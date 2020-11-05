const usuarioDAO = require('../../dao/usuarioDAO')
const usuarioController = require('../../controller/usuarioController')

DAOUsuario = new usuarioDAO(database)
controllerUsuario = new usuarioController()
routesUsuario = controllerUsuario.routes()

module.exports = (app) => {
    app.route(routesUsuario.base)
        .get(controllerUsuario.all())
        .post(controllerUsuario.insert())
        .put(controllerUsuario.update())
        .delete(controllerUsuario.delete())

    app.get(routesUsuario.getLogin, controllerUsuario.get())
}