// responsavel por fazer a conexão com o bd e carregar os models
import Sequelize from 'sequelize';

import User from '../app/models/User';
import databaseConfig from '../config/database';

const models = [User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // criando conexão com o banco de dados
    this.connection = new Sequelize(databaseConfig);

    // this.connection é variavel esperada nos nossos models
    models.map(model => {
      return model.init(this.connection);
    });
  }
}

export default new Database();
