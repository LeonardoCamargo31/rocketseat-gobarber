import nodemailder from 'nodemailer';
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
  }

  sendMail(message) {
    return this.trasnporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
