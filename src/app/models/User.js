import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(connection) {
    // esses campos não precisam ser um reflexo da nossa tabela db
    // podemos ter campos virtuais, um campo que não existe do db
    const props = {
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.VIRTUAL,
      password_hash: Sequelize.STRING,
      provider: Sequelize.BOOLEAN,
    };
    // chamando o método init do Model, e passando a conexão
    super.init(props, { sequelize: connection });

    // trechos de códigos executados baseado em ações
    // esse é executado antes de salvar(create a update)
    this.addHook('beforeSave', async user => {
      // sempre que password ser informado
      if (user.password) {
        // hash(senha,numero de rounds)
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    // sempre retorno o model que foi inicializado
    return this;
  }

  checkPassword(password) {
    // User.checkPassword, logo o this tem todos os dados do usuario
    return bcrypt.compare(password, this.password_hash);
  }

  static associate(models) {
    // belongsTo => pertence há...
    // hasOne => teria o id do `usuario` dentro da tabela de `file`
    // hasMany => teria o id do `usuario` em varios registros em `file`
    // ou seja `file` pertece a `usuario`
    this.belongsTo(models.File, { foreignKey: 'avatar_id' });
  }
}

export default User;
