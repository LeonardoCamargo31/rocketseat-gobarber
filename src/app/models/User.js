import Sequelize, { Model } from 'sequelize';

class User extends Model {
  static init(connection) {
    const props = {
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      password_hash: Sequelize.STRING,
      provider: Sequelize.BOOLEAN,
    };
    // chamando o método init do Model, e passando a conexão
    super.init(props, { sequelize: connection });
  }
}

export default User;
