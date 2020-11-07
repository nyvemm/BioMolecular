const laudoDAO = require('../../dao/laudoDAO')
const laudoController = require('../../controller/laudoController')

DAOLaudo = new laudoDAO(database)
controllerLaudo = new laudoController()
routesLaudo = controllerLaudo.routes()

module.exports = (app) => {
    app.route(routesLaudo.base)
        .get(controllerLaudo.all())
        .post(controllerLaudo.insert())
        .put(controllerLaudo.update())
        .delete(controllerLaudo.delete())

    app.get(routesLaudo.getId, controllerLaudo.get())
}