class usuarioController {

    routes() {
        return {
            base: '/usuarios/',
            getLogin: '/usuarios/:login'
        }
    }

    all() {
        return async function(req, res) {
            await DAOUsuario.getUsuarios()
                .then(data => res.json(data))
                .catch(error => res.json(error))
        }
    }

    get() {
        return async function(req, res) {
            const login = req.params.login
            await DAOUsuario.getUsuario(login)
                .then(data => res.json(data))
                .catch(error => res.json(error))
        }
    }

    insert() {
        return async function(req, res) {
            const data = req.body
            await DAOUsuario.addUsuario(data)
                .then(data => res.json(data))
                .catch(error => res.json(error))
        }
    }

    update() {
        return async function(req, res) {
            const data = req.body
            await DAOUsuario.updateUsuario(data)
                .then(data => res.json(data))
                .catch(error => res.json(error))
        }
    }

    delete() {
        return async function(req, res) {
            const login = req.body.login
            await DAOUsuario.removeUsuario(login)
                .then(data => res.json(data))
                .catch(error => res.json(error))
        }
    }

}

module.exports = usuarioController