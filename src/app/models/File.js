import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(connection) {
    const props = {
      name: Sequelize.STRING,
      path: Sequelize.STRING,
      url: {
        type: Sequelize.VIRTUAL,
        get() {
          return `${process.env.APP_URL}/files/${this.path}`; // path que é nome do arquivo
        },
      },
    };
    super.init(props, { sequelize: connection });
    return this;
  }
}

export default File;
