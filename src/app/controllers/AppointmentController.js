// agenda do cliente
import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

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

    return res.json(appointment);
  }
}
export default new AppointmentController();
