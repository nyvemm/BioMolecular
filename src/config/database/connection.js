//Cria a conexão com o banco de dados
var database = require('knex')({
    client: 'pg',
    version: '7.2',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'master',
        database: 'biomol'
    }
})

module.exports = database