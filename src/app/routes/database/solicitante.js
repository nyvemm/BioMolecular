const SolicitanteDAO = require('../../dao/solicitanteDAO');
const SolicitanteController = require('../../controller/solicitanteController');
const solicitanteModel = require('../../models/solicitanteModel');

module.exports =  (app, database) => {
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
