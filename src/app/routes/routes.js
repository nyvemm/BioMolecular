database = require('../../config/database/connection')
dummy = require('../../config/database/dummy')

const routesUsuario = require('./database/usuario')
const routeSolicitante = require('./database/solicitante')

// Criação do banco de dados
dummy()
    .then((data) => { console.log('SERVER: [Banco de Dados Criado com Sucesso]') })
    .catch((error) => {
        console.log('SERVER: [Falha em criar Banco de Dados]')
    })

module.exports = (app) => {
    routesUsuario(app)
    routeSolicitante(app)
}