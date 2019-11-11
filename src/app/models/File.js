import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(connection) {
    const props = {
      name: Sequelize.STRING,
      path: Sequelize.STRING,
      url: {
        type: Sequelize.VIRTUAL,
        get() {
          return `http://localhost:3333/files/${this.path}`; // path que é nome do arquivo
        },
      },
    };
    super.init(props, { sequelize: connection });
    return this;
  }
}

export default File;
