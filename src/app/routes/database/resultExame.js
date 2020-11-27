const resultExameDAO = require('../../dao/resultExameDAO')
const resultExameController = require('../../controller/resultExameController')

DAOResultExame = new resultExameDAO(database)
controllerResultExame = new resultExameController()
routesResultExame = controllerResultExame.routes()

module.exports = (app) => {
    app.route(routesResultExame.base)
        .get(controllerResultExame.all())
        .post(controllerResultExame.insert())
        .put(controllerResultExame.update())
        .delete(controllerResultExame.delete())
    app.get(routesResultExame.getId, controllerResultExame.get())
}