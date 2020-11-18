const { validationResult } = require('express-validator')

class solicitanteController {

    routes() {
        return {
            base: '/solicitantes/',
            getLogin: '/solicitantes/:id'
        }
    }

    all() {
        return async function(req, res) {
            await DAOSolicitante.getSolicitantes()
                .then(data => res.json(data))
                .catch(error => res.json(error))
        }
    }

    get() {
        return async function(req, res) {
            const id = req.params.id
            await DAOSolicitante.getSolicitante(id)
                .then(data => res.json(data))
                .catch(error => res.json(error))
        }
    }

    insert() {

        return async function(req, res) {
            //Recebe os erros de validação da requisição.
            const validation = validationResult(req)

            if (validation.array().length != 0) {
                res.json({ status: 'error', message: validation['errors'] })
            } else {
                const data = req.body
                await DAOSolicitante.addSolicitante(data)
                    .then(data => res.json(data))
                    .catch(error => res.json(error))
            }
        }
    }

    update() {
        return async function(req, res) {
            //Recebe os erros de validação da requisição.
            const validation = validationResult(req)

            if (validation.array().length != 0) {
                res.json({ status: 'error', message: validation['errors'] })
            } else {
                const data = req.body
                await DAOSolicitante.updateSolicitante(data)
                    .then(data => res.json(data))
                    .catch(error => res.json(error))
            }
        }
    }

    delete() {
        return async function(req, res) {
            //Recebe os erros de validação da requisição.
            const validation = validationResult(req)

            if (validation.array().length != 0) {
                res.json({ status: 'error', message: validation['errors'] })
            } else {
                const id = req.body.id
                await DAOSolicitante.removeSolicitante(id)
                    .then(data => res.json(data))
                    .catch(error => res.json(error))
            }
        }
    }

}

module.exports = solicitanteController