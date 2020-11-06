const pacienteDAO = require('../../dao/pacienteDAO')
const pacienteController = require('../../controller/pacienteController')

DAOPaciente = new pacienteDAO(database)
controllerPaciente = new pacienteController()
routesPaciente = controllerPaciente.routes()

module.exports = (app) => {
    app.route(routesPaciente.base)
        .get(controllerPaciente.all())
        .post(controllerPaciente.insert())
        .put(controllerPaciente.update())
        .delete(controllerPaciente.delete())

    app.get(routesPaciente.getId, controllerPaciente.get())
}