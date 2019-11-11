import Sequelize, { Model } from 'sequelize';

class Appointments extends Model {
  static init(connection) {
    const props = {
      date: Sequelize.DATE,
      canceled_at: Sequelize.DATE,
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
