const resultExameDAO = require('../../dao/resultExameDAO')
const resultExameController = require('../../controller/resultExameController')
const resultExameModel = require('../../models/resultExameModel')

DAOResultExame = new resultExameDAO(database)
controllerResultExame = new resultExameController()
routesResultExame = controllerResultExame.routes()

module.exports = (app) => {
    app.route(routesResultExame.base)
        .get(controllerResultExame.all())
        .post(resultExameModel.validations(), controllerResultExame.insert())
        .put(resultExameModel.updateValidations(), controllerResultExame.update())
        .delete(resultExameModel.removeValidations(), controllerResultExame.delete())
        
    app.get(routesResultExame.getId, controllerResultExame.get())
}