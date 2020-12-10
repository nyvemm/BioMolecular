const { validationResult } = require('express-validator')

class exameController {

    routes() {
        return {
            base: '/exame/',
            getId: '/exame/:id'
        }
    }

    all() {
        return async function(req, res) {
            const data = req.query
            await DAOExame.getExames(data)
                .then(data => res.json(data))
                .catch(error => res.json(error))
        }
    }

    get() {
        return async function(req, res) {
            const id = req.params.id
            await DAOExame.getExame(id)
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
                await DAOExame.addExame(data)
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
                await DAOExame.updateExame(data)
                    .then(data => res.json(data))
                    .catch(error => res.json(error))
            }
        }
    }

    delete() {
        return async function(req, res) {
            const id = req.query.id
            await DAOExame.deleteExame(id)
                .then(data => res.json(data))
                .catch(error => res.json(error))
        }
    }

}

module.exports = exameController