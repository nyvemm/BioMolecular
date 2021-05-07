/* eslint-disable import/extensions */
import ExameDAO from '../../dao/exameDAO.js';
import ExameController from '../../controller/exameController.js';
import ExameModel from '../../models/exameModel.js';

export default (app, database) => {
  const DAOExame = new ExameDAO(database);
  const controllerExame = new ExameController(DAOExame);
  const routesExame = ExameController.routes();

  app.route(routesExame.base)
    .get(controllerExame.all())
    .post(ExameModel.validations(), controllerExame.insert())
    .put(ExameModel.updateValidations(), controllerExame.update())
    .delete(controllerExame.delete());

  app.get(routesExame.getId, controllerExame.get());
};
