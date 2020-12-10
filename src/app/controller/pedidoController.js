const { validationResult } = require('express-validator')

class pedidoController {

    routes() {
        return {
            base: '/pedido/',
            getId: '/pedido/:idPedido'
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
            //Recebe os erros de validação da requisição.
            const validation = validationResult(req)

            if (validation.array().length != 0) {
                res.json({ status: 'error', message: validation['errors'] })
            } else {
                const data = req.body
                await DAOPedido.addPedido(data)
                    .then(data => resp.json(data))
                    .catch(error => resp.json(error))
            }
        }
    }

    update() {
        return async function(req, resp) {
            //Recebe os erros de validação da requisição.
            const validation = validationResult(req)

            if (validation.array().length != 0) {
                res.json({ status: 'error', message: validation['errors'] })
            } else {
                const data = req.body
                await DAOPedido.updatePedido(data)
                    .then(data => resp.json(data))
                    .catch(error => resp.json(error))
            }
        }
    }

    delete() {
        return async function(req, resp) {
            //Recebe os erros de validação da requisição.
            const validation = validationResult(req)

            if (validation.array().length != 0) {
                res.json({ status: 'error', message: validation['errors'] })
            } else {
                const id = req.body.idPedido
                await DAOPedido.removePedido(id)
                    .then(data => resp.json(data))
                    .catch(error => resp.json(error))
            }
        }
    }

}

module.exports = pedidoController