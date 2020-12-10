const { validationResult } = require('express-validator')

class resultExameController {

    routes() {
        return {
            base: '/resultExame/',
            getId: '/resultExame/:idResultExame'
        }
    }

    all() {
        return async function(req, resp) {
            await DAOResultExame.getResultExames()
                .then(data => resp.json(data))
                .catch(error => resp.json(error))
        }
    }

    get() {
        return async function(req, resp) {
            const id = req.params.idResultExame
            await DAOResultExame.getResultExame(id)
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
                await DAOResultExame.addResultExame(data)
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
                await DAOResultExame.updateResultExame(data)
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
                const id = req.body.idResultado
                await DAOResultExame.removeResultExame(id)
                    .then(data => resp.json(data))
                    .catch(error => resp.json(error))
            }
        }
    }

}

module.exports = resultExameController