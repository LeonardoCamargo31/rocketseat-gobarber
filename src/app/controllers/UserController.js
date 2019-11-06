import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async store(req, res) {
    // defino o schema do meu objeto
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .min(3),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });
    // passando meu body, e checando se é valido
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro na validação' });
    }

    // checar se já existe usuario com esse email
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      // bad request
      return res.status(400).json({ error: 'Usuário já existe' });
    }
    const { id, name, email, provider } = await User.create(req.body);
    return res.json({ id, name, email, provider });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().min(3),
      email: Yup.string().email(),
      // caso ele informa a senha antiga, quero validar a senha nova
      oldPassword: Yup.string().min(6),
      // quando oldPassword for preenchida (valor, field se refere ao password)
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) => {
          // se estiver preenchido, password é requerido
          return oldPassword ? field.required() : field;
        }),
      confirmPassword: Yup.string().when('password', (password, field) => {
        // caso tenha senha, o confirmar senha é requerido
        // e deve ser igual a password
        return password ? field.required().oneOf([Yup.ref('password')]) : field;
      }),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro na validação' });
    }

    const { email, oldPassword } = req.body;
    const user = await User.findByPk(req.userId);

    // se ele estiver atualizando o email
    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'Usuário já existe' });
      }
    }

    // se ele estiver atualizando a senha, comparo se a senha antiga esta correta
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({ id, name, email, provider });
  }
}

export default new UserController();
