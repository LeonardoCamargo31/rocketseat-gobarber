// multiform data é o unico formato que aceita arquivos
import multer from 'multer';
import crypto from 'crypto';
// extname pegar a extensão
// resolve resolve uma sequência de caminhos ou segmentos de caminho em um caminho absoluto
import { extname, resolve } from 'path';

export default {
  // como vamos guardar
  storage: multer.diskStorage({
    // __dirname onde estou, .. <- config, .. <- src, -> tmp, -> uploads
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) {
          return cb(err);
        }
        // cb primeiro parametro é o erro, nome da imagem
        // convertendo meus 16 Bytes para string, por exemplo eddewd5edwdeew
        // pegando a extensão do arquivo, por exemplo .jpeg
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
