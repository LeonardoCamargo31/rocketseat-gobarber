export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default: {
    from: 'Equipe GoBarber <noreply@gobarber.com>',
  },
};

// amazon SES
// Mailgun
// Sparkpost
// Mandril (Mailchimp)

// Vamos usar o Mailtrap, ele só funciona em ambiente de desenvolvimento
