//Cria a conexão com o banco de dados
var database = require('knex')({
    client: 'mysql',
    connection: {
        host: 'isp3.ufms.br',
        user: 'c54belini_junior',
        password: '4fMttFNYq!z',
        database: 'c54biomol'
    }
})

module.exports = database