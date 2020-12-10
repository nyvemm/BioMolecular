database = require('../../config/database/connection')
    /* Rotas do front-end */
const routesLogin = require('./system/login')
const routesPrincipal = require('./system/principal')
const routesPacientes = require('./system/pacientes')
const routesSolicitantes = require('./system/solicitantes')
const routesExames = require('./system/exames')
const routesAmostras = require('./system/amostras')

module.exports = (app) => {
    /* Rotas do front-end */
    routesLogin(app)
    routesPrincipal(app)
    routesPacientes(app)
    routesSolicitantes(app)
    routesExames(app)
    routesAmostras(app)
}