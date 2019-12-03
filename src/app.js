// por padrão o node não suporta import/export
// para isso existe o sucrase
import express from 'express';
import Youth from 'youch';
import path from 'path';
import * as Sentry from '@sentry/node';
// quando fazemos um async por padrão o express não capta esses erros
// assim não envia ao sentry, mas para isso temos essa lib
import 'express-async-errors';
import routes from './routes';

import sentryConfig from './config/sentry';
import './database';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    // quando temos um erro, fica eternamente no erro, vamos tratar isso no método exceptionHandler
    this.exceptionHandler();
  }

  middlewares() {
    // o request handler deve ser o primeiro middleware
    this.server.use(Sentry.Handlers.requestHandler());
    // nossa aplicação suporta requisições no formato de json
    this.server.use(express.json());
    // servir arquivos estaticos
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    // como as rotas tb são middlewares, passamos ela através do .use
    this.server.use(routes);

    // depois de todas as nossas rotas
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    // quando temos um middleware com 4 parametros
    // o express já entende como um middleware de tratamento de exceções
    this.server.use(async (err, req, res, next) => {
      // youth faz uma tratativa das mensagens de erro, para uma melhor vizualização
      const errors = await new Youth(err, req).toJSON();
      return res.status(500).json(errors);
    });
  }
}

// retorno uma nova instância de app
// a unica coisa que pode ser acessa dessa classe é o server, então já exporto ele diretamente
export default new App().server;
