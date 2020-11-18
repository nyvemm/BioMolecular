const solicitanteDAO = require('../../dao/solicitanteDAO')
const solicitanteController = require('../../controller/solicitanteController')
const solicitanteModel = require('../../models/solicitanteModel')

DAOSolicitante = new solicitanteDAO(database)
controllerSolicitante = new solicitanteController()
routesSolicitante = controllerSolicitante.routes()

module.exports = (app) => {
    app.route(routesSolicitante.base)
        .get(controllerSolicitante.all())
        .post(solicitanteModel.validations(), controllerSolicitante.insert())
        .put(solicitanteModel.updateValidations(), controllerSolicitante.update())
        .delete(solicitanteModel.removeValidations(), controllerSolicitante.delete())

    app.get(routesSolicitante.getLogin, controllerSolicitante.get())
}