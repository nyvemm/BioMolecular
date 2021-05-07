/* eslint-disable import/extensions */
import UsuarioDAO from '../../dao/usuarioDAO.js';
import UsuarioController from '../../controller/usuarioController.js';
import UsuarioModel from '../../models/usuarioModel.js';
import multer from '../../../config/express/file-upload.js';

export default (app, database) => {
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
