import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail'; // chave unica
  }

  // a tarefa que vai executar quando o processo for executado
  async handle({ data }) {
    const { appointment } = data;

    console.log('A fila executou');

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      // text: 'Você tem um novo cancelamento',
      template: 'cancellation',
      context: {
        // envio todas as variaveis
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'dia' dd 'de' MMMM', ás' H:mm'h'",
          pt // para o mês MMMM ficar em português
        ),
      },
    });
  }
}

export default new CancellationMail();

// CancellationMail.key propriedade
