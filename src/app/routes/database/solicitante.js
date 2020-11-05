const solicitanteDAO = require('../../dao/solicitanteDAO')
const solicitanteController = require('../../controller/solicitanteController')

DAOSolicitante = new solicitanteDAO(database)
controllerSolicitante = new solicitanteController()
routesSolicitante = controllerSolicitante.routes()

module.exports = (app) => {
    app.route(routesSolicitante.base)
        .get(controllerSolicitante.all())
        .post(controllerSolicitante.insert())
        .put(controllerSolicitante.update())
        .delete(controllerSolicitante.delete())

    app.get(routesSolicitante.getLogin, controllerSolicitante.get())
}