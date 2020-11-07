database = require('../../config/database/connection')
dummy = require('../../config/database/dummy')

const routesUsuario = require('./database/usuario')
const routesPaciente = require('./database/paciente')
const routeSolicitante = require('./database/solicitante')
const routeExame = require('./database/exame')
const routeLaudo = require('./database/laudo')

// Criação do banco de dados
dummy()
    .then((data) => { console.log('SERVER: [Banco de Dados Criado com Sucesso]') })
    .catch((error) => {
        console.log('SERVER: [Falha em criar Banco de Dados]')
    })

module.exports = (app) => {
    routesUsuario(app)
    routesPaciente(app)
    routeSolicitante(app)
    routeExame(app)
    routeLaudo(app)
}