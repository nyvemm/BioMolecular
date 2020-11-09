const amostraDAO = require('../../dao/amostraDAO')
const amostraController = require('../../controller/amostraController')

DAOAmostra = new amostraDAO(database)
controllerAmostra = new amostraController()
routesAmostra = controllerAmostra.routes()

console.log(routesAmostra)
module.exports = (app) => {
    app.route(routesAmostra.base)
        .get(controllerAmostra.all())
        .post(controllerAmostra.insert())
        .put(controllerAmostra.update())
        .delete(controllerAmostra.delete())

    app.get(routesAmostra.getId, controllerAmostra.get())
}