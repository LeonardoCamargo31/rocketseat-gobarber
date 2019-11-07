// criar a tabela
// criar a migrate yarn sequelize migration:create --name=create-files
// configuro minha migrate
// então gero a tabela yarn sequelize db:migrate

// criar a migrate yarn sequelize migration:create --name=add-avatar-field-to-user
// depois de configurar a migrate
// yarn sequelize db:migrate
import File from '../models/File';

class FileController {
  async store(req, res) {
    // originalname nome original
    // filename que é o atual
    const { originalname: name, filename: path } = req.file;
    const file = await File.create({ name, path });
    return res.json(file);
  }
}

export default new FileController();
