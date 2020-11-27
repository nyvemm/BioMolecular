const pedidoDAO = require('../../dao/pedidoDAO')
const pedidoController = require('../../controller/pedidoController')

DAOPedido = new pedidoDAO(database)
controllerPedido = new pedidoController()
routesPedido = controllerPedido.routes()

module.exports = (app) => {
    app.route(routesPedido.base)
        .get(controllerPedido.all())
        .post(controllerPedido.insert())
        .put(controllerPedido.update())
        .delete(controllerPedido.delete())

    app.get(routesPedido.getId, controllerPedido.get())
}