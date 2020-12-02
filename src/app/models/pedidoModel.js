const { check } = require('express-validator/check')

class pedidoModel {
    static validations() {
        return [
            check('idAmostra').trim().not().isEmpty().withMessage('O ID da Amostra precisa ser informado').bail()
            .isInt().withMessage('O ID precisa ser um número inteiro'),

            check('idLaudo').trim().not().isEmpty().withMessage('O ID do Laudo precisa ser informado').bail()
            .isInt().withMessage('O ID precisa ser um número inteiro'),

            check('idPaciente').trim().not().isEmpty().withMessage('O ID do Paciente precisa ser informado').bail()
            .isInt().withMessage('O ID precisa ser um número inteiro')
        ]
    }

    static removeValidations() {
        return [
            check('idPedido').trim().not().isEmpty().withMessage('O ID do Pedido precisa ser informado').bail()
            .isInt().withMessage('O ID precisa ser um número inteiro')
        ]
    }

    static updateValidations() {
        return this.validations().concat(this.removeValidations())
    }
}

module.exports = pedidoModel