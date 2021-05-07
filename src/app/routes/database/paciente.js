/* eslint-disable import/extensions */
import PacienteDAO from '../../dao/pacienteDAO.js';
import PacienteController from '../../controller/pacienteController.js';
import PacienteModel from '../../models/pacienteModel.js';

export default (app, database) => {
  const DAOPaciente = new PacienteDAO(database);
  const controllerPaciente = new PacienteController(DAOPaciente);
  const routesPaciente = PacienteController.routes();

  app.route(routesPaciente.base)
    .get(controllerPaciente.all())
    .post(PacienteModel.validations(), controllerPaciente.insert())
    .put(PacienteModel.updateValidations(), controllerPaciente.update())
    .delete(PacienteModel.removeValidations(), controllerPaciente.delete());

  app.get(routesPaciente.getId, controllerPaciente.get());
};
