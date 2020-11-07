class exameController {

    routes() {
        return{
            base : '/exames/',
            getId : '/exames/:id'
        }
    }

    all() {
        return async function(req, resp) {
            await DAOExame.getExames()
                .then(data => resp.json(data))
                .catch(error => resp.json(error))
        }
    }

    get() {
        return async function(req, resp) {
            const id = req.params.id
            await DAOExame.getExame(id)
                .then(data => resp.json(data))
                .catch(error => resp.json(error))
        }
    }

    insert() {
        return async function(req, resp) {
            const data = req.body
            await DAOExame.addExame(data)
                .then(data => resp.json(data))
                .catch(error => resp.json(error))
        }
    }

    update() {
        return async function(req, resp) {
            const data = req.body
            await DAOExame.updExame(data)
                .then(data => resp.json(data))
                .catch(error => resp.json(error))
        }
    }

    delete() {
        return async function(req, resp) {
            const id = req.body.idExame
            await DAOExame.delExame(id)
                .then(data => resp.json(data))
                .catch(error => resp.json(error))
        }
    }

}

module.exports = exameController