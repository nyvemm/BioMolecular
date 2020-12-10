const { check } = require('express-validator')

class laudoModel {

    static validations() {
        return [
            check('dt_liberacao').trim().not().isEmpty().withMessage('É necessário informar a data de liberação do Laudo.').bail()
            .isDate().withMessage('É necessário informar uma data válida.')
        ]
    }

    static removeValidations() {
        return [
            check('idLaudo').trim().not().isEmpty().withMessage('É necessário informar o ID.').bail()
            .isInt().withMessage('O ID precisa ser um número inteiro.')
        ]
    }

    static updateValidations() {
        return this.validations().concat(this.removeValidations)
    }
}

module.exports = laudoModel