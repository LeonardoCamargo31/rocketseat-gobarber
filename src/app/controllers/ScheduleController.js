// agenda do provider
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize'; // operação do sequelize, para usar o between
import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController {
  async index(req, res) {
    // checar se ele é um provider
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider' });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId, // agendamentos do provider
        canceled_at: null, // não esta cancelado
        date: {
          // entre duas datas, inicio do dia 00:00:00 e final do dia 23:59:59
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
    });
    return res.json(appointments);
  }
}

export default new ScheduleController();
