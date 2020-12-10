const exameDAO = require('../../dao/exameDAO')
const exameController = require('../../controller/exameController')
const exameModel = require('../../models/exameModel')

DAOExame = new exameDAO(database)
controllerExame = new exameController()
routesExame = controllerExame.routes()

module.exports = (app) => {
    app.route(routesExame.base)
        .get(controllerExame.all())
        .post(exameModel.validations(), controllerExame.insert())
        .put(exameModel.updateValidations(), controllerExame.update())
        .delete(controllerExame.delete())

    app.get(routesExame.getId, controllerExame.get())
}