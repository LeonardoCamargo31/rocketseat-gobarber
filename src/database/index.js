// responsavel por fazer a conexão com o bd e carregar os models
import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

import databaseConfig from '../config/database';

const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
    this.mongo();
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

  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
    });
  }
}

export default new Database();
