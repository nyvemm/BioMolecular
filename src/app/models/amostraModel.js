const { check } = require('express-validator/check')

class amostraModel {
    
    static validations() {
        return [
            check('idPaciente').trim().not().isEmpty().withMessage('O ID do Paciente precisa ser informado.').bail()
            .isInt().withMessage('O ID do paciente precisa ser um número.'),

            check('idSolicitante').trim().not().isEmpty().withMessage('O ID do Solicitante precisa ser informado.').bail()
            .isInt().withMessage('O ID do Solicitante precisa ser um número.'),

            check('material').trim().not().isEmpty().withMessage('O material da Amostra precisa ser informado').bail()
            .isLength({ min: 3, max: 45 }).withMessage('O material precisa ter entre 3 e 45 caracteres'),

            check('dt_coleta').trim().not().isEmpty().withMessage('A data de coleta da Amostra precisa ser informado.').bail()
            .isDate().withMessage('A data informada precisa ser válida'),

            check('dt_recebimento').trim().not().isEmpty().withMessage('A data de recebimento da Amostra precisa ser informado.').bail()
            .isDate().withMessage('A data informada precisa ser válida')
        ]
    }

    static removeValidations() {
        return [
            check('idAmostra').trim().not().isEmpty().withMessage('O ID da Amostra precisa ser informado.').bail()
            .isInt().withMessage('O ID da Amostra precisa ser um número.')
        ]
    }

    static updateValidations() {
        return this.validations().concat(this.removeValidations)
    }

}

module.exports = amostraModel