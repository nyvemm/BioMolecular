const UsuarioDAO = require('../../dao/usuarioDAO');
const UsuarioController = require('../../controller/usuarioController');
const UsuarioModel = require('../../models/usuarioModel');
const multer = require('../../../config/express/file-upload');

module.exports =  (app, database) => {
  const DAOUsuario = new UsuarioDAO(database);
  const controllerUsuario = new UsuarioController(DAOUsuario);
  const routesUsuario = UsuarioController.routes();

  app.route(routesUsuario.base)
    .get(controllerUsuario.all())
    .post(UsuarioModel.validations(), controllerUsuario.insert())
    .put(multer.single('foto'), UsuarioModel.updateValidations(), controllerUsuario.update())
    .delete(UsuarioModel.removeValidations(), controllerUsuario.delete());

  app.get(routesUsuario.getLogin, controllerUsuario.get());
};
