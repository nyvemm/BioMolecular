const { check } = require('express-validator')

class amostraModel {

    static validations() {
        return [
            check('idpaciente').trim().not().isEmpty().withMessage('O ID do paciente precisa ser informado.').bail()
            .isInt().withMessage('O ID do paciente precisa ser um número.'),

            check('idsolicitante').trim().not().isEmpty().withMessage('O ID do solicitante precisa ser informado.').bail()
            .isInt().withMessage('O ID do solicitante precisa ser um número.'),

            check('material').trim().not().isEmpty().withMessage('O material da amostra precisa ser informado').bail()
            .isLength({ min: 3, max: 45 }).withMessage('O material precisa ter entre 3 e 45 caracteres'),

            check('dt_coleta').trim().not().isEmpty().withMessage('A data da coleta da amostra precisa ser informada.').bail()
            .isDate().withMessage('A data informada precisa ser válida'),
        ]
    }

    static removeValidations() {
        return [
            check('idamostra').trim().not().isEmpty().withMessage('O ID da Amostra precisa ser informado.').bail()
            .isInt().withMessage('O ID da Amostra precisa ser um número.')
        ]
    }

    static updateValidations() {
        return this.validations().concat(this.removeValidations)
    }

}

module.exports = amostraModel