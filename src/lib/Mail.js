import nodemailder from 'nodemailer';
import expressHandlebars from 'express-handlebars';
import nodemailHandlebars from 'nodemailer-express-handlebars';
import { resolve } from 'path';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;

    // como o nodemailer chama uma conexão com algum serviço externo para enviar email
    this.trasnporter = nodemailder.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    // como que o nodemailder compila nossos templates de email, como formata nossas mensagens
    // e o nodemailer-express-handlebars age em cima desse compile do nodemailer
    this.trasnporter.use(
      'compile',
      nodemailHandlebars({
        viewEngine: expressHandlebars.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs', // qual extensão estamos usando, poderia ser .handlebars
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }

  sendMail(message) {
    return this.trasnporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
