//Cria a conexão com o banco de dados
var database = require('knex')({
    client: 'pg',
    version: '7.2',
    connection: {
        host: 'biomol.postgres.uhserver.com',
        user: 'bio_lab',
        password: 'projeto@ufms2021',
        database: 'biomol'
    }
})

module.exports = database