const pacienteDAO = require('../../dao/pacienteDAO')
const pacienteController = require('../../controller/pacienteController')
const pacienteModel = require('../../models/pacienteModel')

DAOPaciente = new pacienteDAO(database)
controllerPaciente = new pacienteController()
routesPaciente = controllerPaciente.routes()

module.exports = (app) => {
    app.route(routesPaciente.base)
        .get(controllerPaciente.all())
        .post(pacienteModel.validations(), controllerPaciente.insert())
        .put(pacienteModel.updateValidations(), controllerPaciente.update())
        .delete(pacienteModel.removeValidations(), controllerPaciente.delete())

    app.get(routesPaciente.getId, controllerPaciente.get())
}