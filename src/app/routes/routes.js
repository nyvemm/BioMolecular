database = require('../../config/database/connection')
dummy = require('../../config/database/dummy')

/* Rotas do back-end */
const routesUsuario = require('./database/usuario')
const routesPaciente = require('./database/paciente')
const routesSolicitante = require('./database/solicitante')
const routesExame = require('./database/exame')
const routesAmostra = require('./database/amostra')

// Criação do banco de dados
dummy()
    .then((data) => { console.log('SERVER: [Banco de Dados Criado com Sucesso]') })
    .catch((error) => {
        console.log('SERVER: [Falha em criar Banco de Dados]')
        console.log(error)
    })

module.exports = (app) => {
    /* Rotas do back-end */
    routesUsuario(app)
    routesPaciente(app)
    routesSolicitante(app)
    routesExame(app)
    routesAmostra(app)
}