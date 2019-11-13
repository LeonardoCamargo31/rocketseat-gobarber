// agenda do cliente
import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointment, { Appointments } from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';

import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      attributes: ['id', 'date'],
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20, // inicia do..., página 2, 2-1 = 1 * 20 = 20
      include: [
        // relacionamento, aparecer dados do provider
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'url', 'path'],
            },
          ],
        },
      ],
    });
    res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      provider_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;

    // verificar se ele é um provider
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    // parseISO => transforma 2019-07-01T18:00:00-03:00 em date
    // startOfHour => sempre pega inicio da hora, se é 19:30 -> pega apartir de 19:00
    const hourStart = startOfHour(parseISO(date));

    // esta a hora passada, é anterior a data atual
    if (isBefore(hourStart, new Date())) {
      // a data já passou
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    // se o prestador já não tem um agendamento marcado para o mesmo horario
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null, // agendamento não esta cancelado
        date: hourStart,
      },
    });
    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    // criar appointment
    const appointment = await Appointment.create({
      user_id: req.userId, // usuario logado
      provider_id,
      date,
    });

    // notificar prestador de serviço
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', ás' H:mm'h'",
      pt // para o mês MMMM ficar em português
    );
    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointments.findByPk(req.params.id, {
      include: [
        {
          // trazendo dados do provider
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          // trazendo dados do cliente
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    // checar se ele é o dono do agendamento
    if (appointment.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'You dont have permission to cancel this appointment' });
    }

    // ele só pode cancelar até duas horas antes
    // 13:00 -> 11:00, e agora é 11:25, ou seja já passou
    const dateWithSub = subHours(appointment.date, 2); // removendo duas horas
    if (isBefore(dateWithSub, new Date())) {
      return res
        .status(401)
        .json({ error: 'You can only cancel appointment 2 hours in advance' });
    }

    appointment.canceled_at = new Date();
    await appointment.save();

    // chave unica e os dados
    await Queue.add(CancellationMail.key, { appointment });

    return res.json(appointment);
  }
}
export default new AppointmentController();
