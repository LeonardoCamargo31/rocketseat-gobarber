import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import RedisConfig from '../config/redis';

// todos nossos jobs
const jobs = [CancellationMail];

class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  init() {
    // chave unica e tarefa
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: RedisConfig,
        }),
        handle, // que vai processar o job e fazer a tarefa em backgroud, como disparar email
      };
    });
  }

  // a qual fila, dados do job (como por exemplo o appointment)
  add(queue, job) {
    // this.queues[CancellationMail]
    // bee=> linha 17 = bee: new Bee(key, ...
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    // percorendo todos os jobs
    jobs.forEach(job => {
      // this.queues[CancellationMail] a minha chave unica
      const { bee, handle } = this.queues[job.key];
      // em caso de erro ele vai chamar nossa função handleFailure
      bee.on('failed', this.handleFailure).process(handle); // para processar o job
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
