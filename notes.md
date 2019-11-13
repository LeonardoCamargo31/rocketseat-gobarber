## Docker


### Como funciona?
- Criação de ambientes contralados (container)
- Containers expõe portas para comunicação, por exemplo o mysql:3306, postgress:5432 e nossa aplicação na porta 3000

### Principais conceitos
- Imagens, quando falamos de postgress ou mysql, tudo isso são imagens do docker, que podemos colocar em containers
- Container é uma instância de uma imagem
- Docker Registry (Docker Hub), onde vamos encontrar as imagens, e podemos registrar as nossas proprias imagens lá dentro
- Docker file, é a receita para montar a imagem da nossa aplicação, em um ambiente totalmente zerado

### Principais conceitos
- docker run para rodar uma imagem
- nome da minha
- senha
- -p para redirecionamento de porta, por exemplo está na 5433 mirando na 5432
- -d e a imagem que vamos utilizar]

```
docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d  postgres
```

Para ver se meu container está rodando, execulto o seguinte comando:

```
docker ps
```

### Instalando o mongo

```
docker run --name mongobarber -p 27017:27017 -d -t mongo
```

E para conferir se foi feito com sucesso acesse `http://localhost:27017/`.

E terá a seguinte mensagem:
```
It looks like you are trying to access MongoDB over HTTP on the native driver port.
```
Em caso de erro, pode digitar o seguinte comando:
```
docker logs
```

Schemas são como models porem representados através de schemas do mongo no mongo não temos tabelas e sim schemas, que são quase a mesma coisa a diferença é que nas tabelas os dados são estruturados, as colunas são iguais para todos os registros no mongo tem meio que um schema free, liberdade de schema, um registro tem titulo enquanto outro não tem.


Interface para visualizar os dados, temos o mongodb compass, é uma ferramenta criada pelo proprio mongo para vizualizar os dados, segue o link: https://docs.mongodb.com/compass/master/install/

## Sequelize

### ORM
- Uma forma de abstrair o nosso banco de dados, ou seja como nossa aplicação se comunica com o banco de dados
- Tabelas viram models, user.js e project.js

### Manipulação dos dados
- Sem uso do SQL, somente código javascript

```
User.create({
    name: 'Leonardo',
    email: 'leonardo@hotmail.com'
})
```

### Migrations
- Controle de versão para base de dados
- Cada arquivo de migração, contpem instruções para criação, alteração ou remoção de tabelas ou colunas
- Mantém a base de dados atualizada entre os dev, e também do ambiente de produção com o ambiente de desenvolvimento
- Cada arquivo é uma migration e ordenação das migrações ocorre por data
- No ambiente de dev, podemos desfazer uma migration se errarmos algo como rollback
- Depois de enviada aos dev ou para produção, nunca editamos uma migration, caso precise editar, criamos uma nova migration
- Cada migration deve realizar alterações em apenas uma tabela

### Seeds
- São arquivos que populam nossa base de dados para desenvolvimento
- Ele criam dados fakes, são muito populares para testes
- Executável apenas por código
- Jamais será utilizado em produção


## EsLint, Prettier e EditorConfig

Para veririficar se o nosso código está seguindo o padrão, instalamos o ESLint:
```
yarn add eslint -D
```
Para inicializar um arquivo de configuração:
```
yarn eslint --init

How would you like to use ESLint?
To check syntax, find problems, and enforce code style

What type of modules does your project use?
JavaScript modules (import/export)

Which framework does your project use?
None of these

Does your project use TypeScript?
No

Where does your code run?
Node

How would you like to define a style for your project?
Use a popular style guide

Which style guide do you want to follow?
Airbnb (https://github.com/airbnb/javascript)

What format do you want your config file to be in?
JavaScript

Would you like to install them now with npm?
Yes
```
Feito isso ele ira criar um arquivo deleto package-lock.json, que mapeia as novas dependencias, mas como estou usando yarn, então deleto o package-lock.json, e executo no terminal yarn para mapear as novas dependencias.

Instalo no vscode a extensão do ESLint
E em settings.json
```
"editor.rulers": [80,120],
"eslint.autoFixOnSave": true,
"editor.formatOnSave": false,
"eslint.validate": [
    {
        "language": "javascript",
        "autoFix": true
    },
    {
        "language": "javascriptreact",
        "autoFix": true
    }
]
```
E no arquivo .eslintrc.js, vamos sobrescrever algumas regras
```
rules: {
    "class-methods-use-this":"off",//usar this nos métodos
    "no-param-reassign":"off",//para permitir alterar parametro
    "camelcase":"off", // nossaVar, mas quero usar nossa_variavel
    "no-unused-vars":[
        "error",{
            "argsIgnorePattern":"next"
            }
        ]
},
```
no-unused-vars, existe uma regra, que não pode declarar variaveis que não vou usar, mas no caso do next preciso declarar mesmo sem utilizar


Intala o prettier:
```
yarn add prettier eslint-config-prettier eslint-plugin-prettier -D
```
O prettier ele deixa o nosso código mais bonito, e é diferente do EsLint, por exemplo checar que a linha está muito grande, o prettier é responsavel por isso.

Depois de instalado preciso configurar .eslintrc.js, para trabalhar com o prettier
```
module.exports = {
  ...
  extends: ['airbnb-base','prettier'],
  plugins:['prettier'],
  ...
  rules: {
    "prettier/prettier":"error",
    ...
  },
};
```
"prettier/prettier":"error" basicamente dizendo que todos os problemas que o prettier tiver, eu quero que ele me retorne error no EsLint

Mas tem algumas reguinhas que gostaria de sobrescrever do prettier, então criamos o arquivo .prettierrc

```
{
    "singleQuote": true,
    "trailingComma": "es5"
}
```

Ao invés de acessar arquivo por arquivo, e salvar para aplicar as regras do EsLint, podemos fazer o seguinte, para fixar tudo de forma automática:

Para arquivos dentro de src com extensão .js

```
yarn eslint --fix src --ext .js
```

Instalados a extensão no vscode, EditorConfig, depois de instalar isso, vamos na raiz do projeto, clica com o botão direito e "generate .editorconfig", ele faz uma configuração igual entre todos os editores como vscode, atom, sublime e tudo mais


## Configurando o sequelize

Primeira coisa instalamos o sequelize, e sequelize-cli que é uma interface de linha de comando, então usando comandos no terminal para criação de migrations, criar models e etc.

```
yarn sequelize
yarn sequelize-cli -D
```
Feito isso, criamos um arquivo .sequelizerc, é basicamente um arquivo que vai exportar os caminhos os arquivos e pastas de configuração do database, e nele utilizamos a sintaxe CommonJS, que é sintaxe antes do import/export
```
const {resolve} =  require('path')
module.exports = {
    config: resolve(__dirname,'src','config','database.js'),
    'models-path': resolve(__dirname,'src','config','models'),
    'migrations-path': resolve(__dirname,'src','config','migrations'),
    'seeders-path': resolve(__dirname,'src','config','seeds')
}
```
E no arquivo src/config/database.js, esse arquivo vai ser acessado tanto pela nossa aplicação, quanto pelo sequelize-cli, então utilizamos a sintaxe CommonJS. Como vamos utilizar o dialect postgres, temos que instalar algumas dependências
```
yarn add pg  pg-hstore
```
No database.js

`timestamps: true` => Vai armazenar a data de criação e edição de cada registro

`underscored: true` => Quero definir o padrão de nomenclatura para tabelas como underscored, se tiver tivermos um model UserGroup ele vai criar uma tabela UserGroups, mas queremos que seja user_groups

`underscoredAll: true` => E o all, não é para nome da tabela e sim nome de colunas e relacionamentos

E agora podemos criar a nossa tabela

```
yarn sequelize migration:create --name=create-users
```
Configuramos a nossa migration

Feito isso inicializamos o nosso container com o banco `docker start database`, e depois executamos no terminal
```
yarn sequelize db:migrate
```
Caso tenha cometido algum erro, posso executar o seguinte comando:
```
yarn sequelize db:migrate:undo // desfaz a última vez que rodei

yarn sequelize db:migrate:undo:all // desfaz todas
```

## Fila

Filas ou background jobs (trabalhos em segundo plano), podemos configurar serviços que ficam executando em segundo plano, executando essas tarefas que demandam mais tempo, mas que não modificam a resposta ao cliente. Para esse caso precisamos de um banco chave valor, e vamos utilizar o Redis.

O Redis ele é um banco não relacional assim como o mongodb, mas com Redis não conseguimos ter schemas ou estrutura de dados, e apenas conseguimos salvar chave e valor, sendo muito performatico, e permitindo salvar milhares de registros.

```
docker run --name redisbarber -p 6379:6379 -d -t redis:alpine
```
 O bee-queue é basicamente uma ferramenta de fila dentro do node, extramamente performatico, porem mais simples e menos robusto.
