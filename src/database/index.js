// responsavel por fazer a conexão com o bd e carregar os models
import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File';
import databaseConfig from '../config/database';

const models = [User, File];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // criando conexão com o banco de dados
    this.connection = new Sequelize(databaseConfig);

    // this.connection é variavel esperada nos nossos models
    models
      .map(model => model.init(this.connection))
      // caso existe o associate, ai sim executo o associate passand models
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
