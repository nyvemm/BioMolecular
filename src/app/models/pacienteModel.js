const { check } = require('express-validator/check')

class pacienteModel {
    static validations() {
        return [
            check('idAmostra').trim().not().isEmpty().withMessage('O ID do Paciente precisa ser informado.').bail()
            .isInt().withMessage('O ID do paciente precisa ser um número.'),

            check('idAmostra').trim().not().isEmpty().withMessage('O ID do Solicitante precisa ser informado.').bail()
            .isInt().withMessage('O ID do Solicitante precisa ser um número.'),
        ]
    }

    static removeValidations() {
        return [
            check('idSolicitante').trim().not().isEmpty().withMessage('O ID precisa ser informado.').bail()
            .isInt().withMessage('O ID precisa ser um número inteiro')
        ]

    }

    static updateValidations() {
        return this.validations().concat(this.removeValidations())
    }

}

module.exports = pacienteModel