
const AmostraDAO = require('../../dao/amostraDAO');
const AmostraController = require('../../controller/amostraController');
const AmostraModel = require('../../models/amostraModel');

module.exports =  (app, database) => {
  const DAOAmostra = new AmostraDAO(database);
  const controllerAmostra = new AmostraController(DAOAmostra);
  const routesAmostra = AmostraController.routes();

  app.route(routesAmostra.base)
    .get(controllerAmostra.all())
    .post(AmostraModel.validations(), controllerAmostra.insert())
    .put(controllerAmostra.update())
    .delete(controllerAmostra.delete());

  app.get(routesAmostra.getId, controllerAmostra.get());
};
