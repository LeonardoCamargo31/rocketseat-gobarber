import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Appointments extends Model {
  static init(connection) {
    const props = {
      date: Sequelize.DATE,
      canceled_at: Sequelize.DATE,
      past: {
        // se a data já passou
        type: Sequelize.VIRTUAL,
        get() {
          // data do agendamento, data atual
          return isBefore(this.date, new Date()); // true/false
        },
      },
      cancelable: {
        // agendamento só pode ser cancelado, no minimo duas horas antes
        type: Sequelize.VIRTUAL,
        get() {
          // tirando duas horas da data do agendamento, e comparando com a data atual
          // se a data dor depois da data atual, retorna false
          return isBefore(new Date(), subHours(this.date, 2)); // true/false
        },
      },
    };

    super.init(props, { sequelize: connection });

    return this;
  }

  static associate(models) {
    // um compromisso pertence há um usuário
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' }); // devo dar um apelido
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export { Appointments };
export default Appointments;
