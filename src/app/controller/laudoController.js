const { validationResult } = require('express-validator')

class laudoController {

    routes() {
        return{
            base : '/laudos/',
            getId : '/laudos/:id'
        }
    }

    all() {
        return async function(req, resp) {
            await DAOLaudo.getLaudos()
                .then(data => resp.json(data))
                .catch(error => resp.json(error))
        }
    }

    get() {
        return async function(req, resp) {
            const id = req.params.id
            await DAOLaudo.getLaudo(id)
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
                await DAOLaudo.addLaudo(data)
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
                await DAOLaudo.updLaudo(data)
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
                const id = req.body.idLaudo
                await DAOLaudo.delLaudo(id)
                    .then(data => resp.json(data))
                    .catch(error => resp.json(error))
            }
        }
    }

}

module.exports = laudoController