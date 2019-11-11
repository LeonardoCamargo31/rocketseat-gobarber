// por padrão o node não suporta import/export
// para isso existe o sucrase
import express from 'express';
import path from 'path';
import routes from './routes';
import './database';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
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
  }
}

// retorno uma nova instância de app
// a unica coisa que pode ser acessa dessa classe é o server, então já exporto ele diretamente
export default new App().server;
