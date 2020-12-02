const laudoDAO = require('../../dao/laudoDAO')
const laudoController = require('../../controller/laudoController')
const laudoModel = require('../../models/laudoModel')

DAOLaudo = new laudoDAO(database)
controllerLaudo = new laudoController()
routesLaudo = controllerLaudo.routes()

module.exports = (app) => {
    app.route(routesLaudo.base)
        .get(controllerLaudo.all())
        .post(laudoModel.validations(), controllerLaudo.insert())
        .put(laudoModel.updateValidations(), controllerLaudo.update())
        .delete(laudoModel.removeValidations(), controllerLaudo.delete())

    app.get(routesLaudo.getId, controllerLaudo.get())
}