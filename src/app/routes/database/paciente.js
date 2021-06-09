const PacienteDAO = require('../../dao/pacienteDAO');
const PacienteController = require('../../controller/pacienteController');
const PacienteModel = require('../../models/pacienteModel');

module.exports =  (app, database) => {
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
