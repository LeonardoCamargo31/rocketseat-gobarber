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


## EsLint, Prettier e editor de código

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
        "errors",{
            "argsIgnorePattern":"next"
            }
        ]
},
```
no-unused-vars, existe uma regra, que não pode declarar variaveis que não vou usar, mas no caso do next preciso declarar mesmo sem utilizar



