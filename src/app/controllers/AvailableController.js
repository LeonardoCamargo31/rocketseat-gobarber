import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize'; // operação do sequelize, para usar o between
import Appointment from '../models/Appointment';

class AvailableController {
  async index(req, res) {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }
    const searchDate = parseInt(date, 10);

    // todos os agendamentos do dia
    const appointments = await Appointment.findsAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
          // entre duas datas, inicio do dia 00:00:00 e final do dia 23:59:59
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    // horarios de trabalho do prestador
    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
    ];

    const available = schedule.map(time => {
      const [hour, minute] = time.split(':');
      // agora temos esse formato 2018-06-23 08:00:00
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );
      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"), // 2018-06-23T08:00:00-03:00
        available:
          // é depois da data atual
          isAfter(value, new Date()) &&
          !appointments.find(a => format(a.date, 'HH:mm') === time), // time => [08:00,09:00,...]
      };
    });

    return res.json(available);
  }
}

export default new AvailableController();
