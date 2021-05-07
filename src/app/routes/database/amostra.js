/* eslint-disable import/extensions */
import AmostraDAO from '../../dao/amostraDAO.js';
import AmostraController from '../../controller/amostraController.js';
import AmostraModel from '../../models/amostraModel.js';

export default (app, database) => {
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
