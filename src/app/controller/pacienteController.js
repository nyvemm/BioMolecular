const { validationResult } = require('express-validator')

class pacienteController {

    routes() {
        return {
            base: '/paciente/',
            getId: '/paciente/:id'
        }
    }

    all() {
        return async function(req, res) {
            const data = req.query
            await DAOPaciente.getPacientes(data)
                .then(data => res.json(data))
                .catch(error => res.json(error))
        }
    }

    get() {
        return async function(req, res) {
            const id = req.params.id
            await DAOPaciente.getPaciente(id)
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
                await DAOPaciente.addPaciente(data)
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
                await DAOPaciente.updatePaciente(data)
                    .then(data => res.json(data))
                    .catch(error => res.json(error))
            }
        }
    }

    delete() {
        return async function(req, res) {
            const id = req.query.id
            await DAOPaciente.deletePaciente(id)
                .then(data => res.json(data))
                .catch(error => res.json(error))
        }
    }
}

module.exports = pacienteController