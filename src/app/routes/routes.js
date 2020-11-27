database = require('../../config/database/connection')
dummy = require('../../config/database/dummy')

const routesUsuario = require('./database/usuario')
const routesPaciente = require('./database/paciente')
const routesSolicitante = require('./database/solicitante')
const routesExame = require('./database/exame')
const routesLaudo = require('./database/laudo')
const routesAmostra = require('./database/amostra')
const routesPedido = require('./database/pedido')
const routesResultExame = require('./database/resultExame')

// Criação do banco de dados
dummy()
    .then((data) => { console.log('SERVER: [Banco de Dados Criado com Sucesso]') })
    .catch((error) => {
        console.log('SERVER: [Falha em criar Banco de Dados]')
    })

module.exports = (app) => {
    routesUsuario(app)
    routesPaciente(app)
    routesSolicitante(app)
    routesExame(app)
    routesLaudo(app)
    routesAmostra(app)
    routesPedido(app)
    routesResultExame(app)
}