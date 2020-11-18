const { check } = require('express-validator/check')

class solicitanteModel {
    static validations() {
        return [
            //Verifica se o Login tem o tamanho adequado.
            check('nome').trim().not().isEmpty().withMessage('O Nome precisa ser informado.').bail()
            .isLength({ min: 3, max: 45 }).withMessage('O Nome precisa ter entre 3 e 45 caracteres.'),

            check('estado').trim().not().isEmpty().withMessage('O estado precisa ser informado.').bail()
            .isLength({ min: 2, max: 2 }).withMessage('O estado precisa ter apenas 2 caracteres.'),

            check('cidade').trim().not().isEmpty().withMessage('A cidade precisa ser informada.').bail()
            .isLength({ min: 3, max: 100 }).withMessage('A cidade precisa ter entre 3 e 100 caracteres.'),

            check('endereco').trim().not().isEmpty().withMessage('O endereço precisa ser informado.').bail()
            .isLength({ min: 3, max: 100 }).withMessage('O endereço precisa ter entre 3 e 10 caracteres.'),

            check('contato_referencia').trim().not().isEmpty().withMessage('O contato de referência precisa ser informado.').bail()
            .isMobilePhone('pt-BR').withMessage('O contato de refêrencia precisa ter entre 3 e 45 caracteres.'),

            check('e_mail').trim().not().isEmpty().withMessage('A e-mail precisa ser informado.').bail()
            .isEmail().withMessage('Formato de e-mail inválido.')
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

module.exports = solicitanteModel