const amostraDAO = require('../../dao/amostraDAO')
const amostraController = require('../../controller/amostraController')
const amostraModel = require('../../models/amostraModel')

DAOAmostra = new amostraDAO(database)
controllerAmostra = new amostraController()
routesAmostra = controllerAmostra.routes()

module.exports = (app) => {
    app.route(routesAmostra.base)
        .get(controllerAmostra.all())
        .post(amostraModel.validations(), controllerAmostra.insert())
        .put(controllerAmostra.update())
        .delete(controllerAmostra.delete())

    app.get(routesAmostra.getId, controllerAmostra.get())
}