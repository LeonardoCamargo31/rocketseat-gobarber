import 'dotenv/config';
import Queue from './lib/Queue';
// Por que o arquivo esta aqui? não vamos executar a aplicação na mesma execução da fila
// podemos ter a fila em um servidor, e a aplicação totalmente separada
// node src/queue.js
Queue.processQueue();
