import User from '../models/User';
import File from '../models/File';

class ProviderController {
  async index(req, res) {
    const providers = await User.findAll({
      where: { provider: true }, // quando for provider
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        // incluir um relacionamento
        {
          model: File,
          as: 'avatar', // vai vir como avatar, ao invés de File
          attributes: ['name', 'path', 'url'], // retornar somente esses campos de file
        },
      ],
    });
    return res.json({ providers });
  }
}

export default new ProviderController();
