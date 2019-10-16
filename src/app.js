// por padrão o node não suporta import/export
// para isso existe o sucrase
import express from 'express';
import routes from './routes';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    // nossa aplicação suporta requisições no formato de json
    this.server.use(express.json());
  }

  routes() {
    // como as rotas tb são middlewares, passamos ela através do .use
    this.server.use(routes);
  }
}

// retorno uma nova instância de app
// a unica coisa que pode ser acessa dessa classe é o server, então já exporto ele diretamente
export default new App().server;
