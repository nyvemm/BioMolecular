import knex from 'knex';

// Cria a conexão com o banco de dados
const database = knex({
  client: 'mysql',
  connection: {
    host: 'isp3.ufms.br',
    user: 'c54belini_junior',
    password: '4fMttFNYq!z',
    database: 'c54biomol',
  },
});

export default database;
