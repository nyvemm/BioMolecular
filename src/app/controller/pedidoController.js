class pedidoController {

    routes() {
        return {
            base: '/pedidos/',
            getId: '/pedidos/:idPedido'
        }
    }

    all() {
        return async function(req, resp) {
            await DAOPedido.getPedidos()
                .then(data => resp.json(data))
                .catch(error => resp.json(error))
        }
    }

    get() {
        return async function(req, resp) {
            const id = req.params.idPedido
            await DAOPedido.getPedido(id)
                .then(data => resp.json(data))
                .catch(error => resp.json(error))
        }
    }

    insert() {
        return async function(req, resp) {
            const data = req.body
            await DAOPedido.addPedido(data)
                .then(data => resp.json(data))
                .catch(error => resp.json(error))
        }
    }

    update() {
        return async function(req, resp) {
            const data = req.body
            await DAOPedido.updatePedido(data)
                .then(data => resp.json(data))
                .catch(error => resp.json(error))
        }
    }

    delete() {
        return async function(req, resp) {
            const id = req.body.idPedido
            await DAOPedido.removePedido(id)
                .then(data => resp.json(data))
                .catch(error => resp.json(error))
        }
    }

}

module.exports = pedidoController