const ExameDAO = require('../../dao/exameDAO');
const ExameController = require('../../controller/exameController');
const ExameModel = require('../../models/exameModel');

module.exports =  (app, database) => {
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
