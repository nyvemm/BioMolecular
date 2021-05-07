/* eslint-disable import/extensions */
import SolicitanteDAO from '../../dao/solicitanteDAO.js';
import SolicitanteController from '../../controller/solicitanteController.js';
import solicitanteModel from '../../models/solicitanteModel.js';

export default (app, database) => {
  const DAOSolicitante = new SolicitanteDAO(database);
  const controllerSolicitante = new SolicitanteController(DAOSolicitante);
  const routesSolicitante = SolicitanteController.routes();

  app.route(routesSolicitante.base)
    .get(controllerSolicitante.all())
    .post(solicitanteModel.validations(), controllerSolicitante.insert())
    .put(solicitanteModel.updateValidations(), controllerSolicitante.update())
    .delete(solicitanteModel.removeValidations(), controllerSolicitante.delete());

  app.get(routesSolicitante.getLogin, controllerSolicitante.get());
};
