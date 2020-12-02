const { validationResult } = require('express-validator')

class pacienteController {

    routes() {
        return {
            base: '/pacientes/',
            getId: '/pacientes/:id'
        }
    }

    all() {
        return async function(req, resp) {
            await DAOPaciente.getPacientes()
                .then(data => resp.json(data))
                .catch(error => resp.json(error))
        }
    }

    get() {
        return async function(req, resp) {
            const id = req.params.id
            await DAOPaciente.getPaciente(id)
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
                await DAOPaciente.addPaciente(data)
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
                await DAOPaciente.updPaciente(data)
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
                const id = req.body.idPaciente
                await DAOPaciente.delPaciente(id)
                    .then(data => resp.json(data))
                    .catch(error => resp.json(error))
            }
        }
    }

}

module.exports = pacienteController