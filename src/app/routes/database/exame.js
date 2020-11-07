const exameDAO = require('../../dao/exameDAO')
const exameController = require('../../controller/exameController')

DAOExame = new exameDAO(database)
controllerExame = new exameController()
routesExame = controllerExame.routes()

module.exports = (app) => {
    app.route(routesExame.base)
        .get(controllerExame.all())
        .post(controllerExame.insert())
        .put(controllerExame.update())
        .delete(controllerExame.delete())

    app.get(routesExame.getId, controllerExame.get())
}