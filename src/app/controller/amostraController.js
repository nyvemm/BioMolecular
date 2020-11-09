class amostraController {

    routes() {
        return {
            base: '/amostras/',
            getId: '/amostras/:idAmostra'
        }
    }

    all() {
        return async function(req, res) {
            await DAOAmostra.getAmostras()
                .then(data => res.json(data))
                .catch(error => res.json(error))
        }
    }

    get() {
        return async function(req, res) {
            const id = req.params.idAmostra
            await DAOAmostra.getAmostra(id)
                .then(data => res.json(data))
                .catch(error => res.json(error))
        }
    }

    insert() {
        return async function(req, res) {
            const data = req.body
            await DAOAmostra.addAmostra(data)
                .then(data => res.json(data))
                .catch(error => res.json(error))
        }
    }

    update() {
        return async function(req, res) {
            const data = req.body
            await DAOAmostra.updateAmostra(data)
                .then(data => res.json(data))
                .catch(error => res.json(error))
        }
    }

    delete() {
        return async function(req, res) {
            const id = req.body.idAmostra
            await DAOAmostra.removeAmostra(id)
                .then(data => res.json(data))
                .catch(error => res.json(error))
        }
    }

}

module.exports = amostraController