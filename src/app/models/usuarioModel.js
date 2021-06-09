const { check } = require('express-validator');

class usuarioModel {
  static validations() {
    return [
      // Verifica se o Login tem o tamanho adequado.
      check('login').trim().not().isEmpty()
        .withMessage('O Login precisa ser informado.')
        .bail()
        .isLength({ min: 3, max: 50 })
        .withMessage('O Login precisa ter entre 3 e 50 caracteres.'),

      check('nome').trim().not().isEmpty()
        .withMessage('O nome precisa ser informado.')
        .bail()
        .isLength({ min: 3, max: 50 })
        .withMessage('O nome precisa ter entre 3 e 50 caracteres.'),

      check('senha').trim().not().isEmpty()
        .withMessage('A senha precisa ser informada.')
        .bail()
        .isLength({ min: 3, max: 50 })
        .withMessage('A senha precisa ter entre 3 e 50 caracteres.'),

      check('email').trim().not().isEmpty()
        .withMessage('O e-mail precisa ser informado.')
        .bail()
        .isEmail()
        .withMessage('Formato de e-mail inválido.'),
    ];
  }

  static removeValidations() {
    return [
      check('login').trim().not().isEmpty()
        .withMessage('O login precisa ser informado.'),
    ];
  }

  static updateValidations() {
    return this.validations().concat(this.removeValidations());
  }
}

module.exports =  usuarioModel;
