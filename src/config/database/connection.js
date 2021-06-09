const knex = require('knex');

// Cria a conexão com o banco de dados
const database = knex({
  client: 'mysql',
  connection: {
    host: 'isp3.ufms.br',
    user: 'c54belini_junior',
    password: '4fMttFNYq!z',
    database: 'c54biomol'
  }
});

// const database = knex({
//   client: 'mysql',
//   connection: {
//     host: 'localhost',
//     user: 'root',
//     password: 'master',
//     database: 'c54biomol'
//   }
// });

module.exports = database;
