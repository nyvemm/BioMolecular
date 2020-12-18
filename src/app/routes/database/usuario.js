const usuarioDAO = require('../../dao/usuarioDAO')
const usuarioController = require('../../controller/usuarioController')
const usuarioModel = require('../../models/usuarioModel')
const fileUpload = require('../../../config/express/file-upload')

DAOUsuario = new usuarioDAO(database)
controllerUsuario = new usuarioController()
routesUsuario = controllerUsuario.routes()

module.exports = (app) => {
    app.route(routesUsuario.base)
        .get(controllerUsuario.all())
        .post(usuarioModel.validations(), controllerUsuario.insert())
        .put(fileUpload.upload.single('foto'), usuarioModel.updateValidations(), controllerUsuario.update())
        .delete(usuarioModel.removeValidations(), controllerUsuario.delete())

    app.get(routesUsuario.getLogin, controllerUsuario.get())
}