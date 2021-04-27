const { check } = require('express-validator')

class exameModel {

    static validations() {
        return [
            check('nome').trim().not().isEmpty().withMessage('É necessário informar o nome do exame').bail()
            .isLength({ min: 3, max: 75 }).withMessage('O nome do exame precisa ter entre 3 e 75 caracteres.'),

            check('tipo_analise').trim().not().isEmpty().withMessage('É necessário informar o tipo de exame').bail()
            .isLength({ min: 3, max: 45 }).withMessage('O tipo de exame precisa ter entre 3 e 45 caracteres.'),

            check('metodo').trim().not().isEmpty().withMessage('É necessário informar o metodo do exame.').bail()
            .isLength({ min: 3, max: 75 }).withMessage('O metodo do exame precisa ter entre 3 e 75 caracteres.')

            // check('tipo_resultado').trim().not().isEmpty().withMessage('É necessário informar o tipo do resultado do exame.').bail()
            // .isLength({ max: 50 }).withMessage('O tipo de resultado não pode ter mais de 50 caracteres.'),

            // check('valor_ref').trim().not().isEmpty().withMessage('É necessário informar o valor de referência do exame.').bail()
            // .isLength({ max: 45 }).withMessage('O valor de referência não pode ter mais de 45 caracteres.'),

            // check('tipo_valor_ref').trim().not().isEmpty().withMessage('É necessário informar o tipo do valor de referência do exame').bail()
            // .isLength({ min: 3, max: 45 }).withMessage('O tipo do valor de referência precisa ter entre 3 e 45 caracteres')
        ]
    }

    static removeValidations() {
        return [
            check('idExame').trim().not().isEmpty().withMessage('É necessário informar o ID.').bail()
            .isInt().withMessage('O ID precisa ser um número inteiro.')
        ]
    }

    static updateValidations() {
        return this.validations().concat(this.removeValidations())
    }
}

module.exports = exameModel