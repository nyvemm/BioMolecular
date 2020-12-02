const { check } = require('express-validator/check')

class pacienteModel {
    static validations() {
        return [
            check('idPacienteSolicirante').trim().not().isEmpty().withMessage('O ID do Solicitante do Paciente precisa ser informado.').bail()
            .isInt().withMessage('O ID do Solicitante do Paciente precisa ser um número.'),

            check('nome').trim().not().isEmpty().withMessage('O nome do Paciente precisa ser informado.').bail()
            .isLength({ min: 3, max: 75 }).withMessage('O nome precisa ter entre 3 e 75 caracteres.'),

            check('dt_nasc').trim().not().isEmpty().withMessage('A data de nascimento do Paciente precisa ser informado.').bail()
            .isDate().withMessage('A data de nascimento precisa ser válida.'),

            check('etnia').trim().isEmpty().bail().isLength({ min: 3, max: 45 }).withMessage('A etnica precisa ter entre 3 e 45 caracteres.'),

            check('sexo').trim().not().isEmpty().withMessage('O sexo do Paciente precisa ser informado.').bail()
            .isLength({ max: 1 }).withMessage('O sexo precisa ter apenas dois caracteres.'),

            check('naturalidade_estado').trim().isEmpty().bail()
            .isLength({ min: 2, max: 2 }).withMessage('O estado precisa ter apenas 2 caracteres.'),

            check('naturalidade_cidade').trim().isEmpty().bail()
            .isLength({ min: 3, max: 45 }).withMessage('A cidade precisa ter entre 3 e 45 caracteres.')

        ]
    }

    static removeValidations() {
        return [
            check('idPaciente').trim().not().isEmpty().withMessage('O ID do Paciente precisa ser informado.').bail()
            .isInt().withMessage('O ID precisa ser um número inteiro')
        ]
    }

    static updateValidations() {
        return this.validations().concat(this.removeValidations())
    }

}

module.exports = pacienteModel