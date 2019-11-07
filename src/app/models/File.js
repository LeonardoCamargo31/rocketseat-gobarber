import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(connection) {
    const props = {
      name: Sequelize.STRING,
      path: Sequelize.STRING,
    };
    super.init(props, { sequelize: connection });
    return this;
  }
}

export default File;
