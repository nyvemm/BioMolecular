const { check } = require('express-validator')

class resultExameModel {

    static validations() {
        return [
            check('resultado_possivel').trim().not().isEmpty().withMessage('É necessário informar o resultado possivel para um certo exame.').bail()
            .isLength({ min: 3, max: 75 }).withMessage('O resultado do exame precisa ter entre 3 e 75 caracteres.'),

            check('idade_maior_6m').trim().not().isEmpty().withMessage('É necessário informar se o resultado desse exame é valido para pacientes com mais que 6 meses de idade.').bail()
            .isLength({ max: 1 }).withMessage('Basta digitar S ou N.')
        ]
    }

    static removeValidations() {
        return [
            check('idResultado').trim().not().isEmpty().withMessage('O ID do Resultado de Exame precisa ser informado.').bail()
            .isInt().withMessage('O ID precisa ser um número inteiro.')
        ]
    }

    static updateValidations() {
        return this.validations().concat(this.removeValidations())
    }

}

module.exports = resultExameModel