const { validationResult } = require('express-validator')

class amostraController {

    routes() {
        return {
            base: '/amostra/',
            getId: '/amostra/:idAmostra'
        }
    }

    all() {
        return async function (req, res) {
            const data = req.query
            await DAOAmostra.getAmostras(data)
                .then(data => res.json(data))
                .catch(error => res.json(error))
        }
    }

    get() {
        return async function (req, res) {
            const id = req.params.idAmostra
            await DAOAmostra.getAmostra(id)
                .then(data => res.json(data))
                .catch(error => res.json(error))
        }
    }

    insert() {
        return async function (req, res) {
            //Recebe os erros de validação da requisição.
            const validation = validationResult(req)

            if (validation.array().length != 0) {
                res.json({ status: 'error', message: validation['errors'] })
            } else {
                const data = req.body
                await DAOAmostra.addAmostra(data)
                    .then(data => res.json(data))
                    .catch(error => res.json(error))
            }
        }
    }

    update() {
        return async function (req, res) {
            const data = req.body
            await DAOAmostra.updateAmostra(data)
                .then(data => res.json(data))
                .catch(error => res.json(error))
        }
    }

    delete() {
        return async function (req, res) {
            const id = req.query.id
            await DAOAmostra.removeAmostra(id)
                .then(data => res.json(data))
                .catch(error => res.json(error))
        }
    }
}

module.exports = amostraController