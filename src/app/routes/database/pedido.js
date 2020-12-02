const pedidoDAO = require('../../dao/pedidoDAO')
const pedidoController = require('../../controller/pedidoController')
const pedidoModel = require('../../models/pedidoModel')

DAOPedido = new pedidoDAO(database)
controllerPedido = new pedidoController()
routesPedido = controllerPedido.routes()

module.exports = (app) => {
    app.route(routesPedido.base)
        .get(controllerPedido.all())
        .post(pedidoModel.validations(), controllerPedido.insert())
        .put(pedidoModel.updateValidations(), controllerPedido.update())
        .delete(pedidoModel.removeValidations(), controllerPedido.delete())

    app.get(routesPedido.getId, controllerPedido.get())
}