import { check } from 'express-validator';

class PacienteModel {
  static validations() {
    return [
      check('nome').trim().not().isEmpty()
        .withMessage('O nome do paciente precisa ser informado.')
        .bail()
        .isLength({ min: 3, max: 75 })
        .withMessage('O nome precisa ter entre 3 e 75 caracteres.'),

      check('dt_nasc').trim().not().isEmpty()
        .withMessage('A data de nascimento do paciente precisa ser informado.')
        .bail()
        .isDate()
        .withMessage('A data de nascimento precisa ser válida.'),

      check('etnia').trim().not().isEmpty()
        .withMessage('A etnia do paciente precisa ser informada.')
        .bail()
        .isLength({ min: 3, max: 45 })
        .withMessage('A etnia precisa ter entre 3 e 45 caracteres.'),

      check('sexo').trim().not().isEmpty()
        .withMessage('O sexo do paciente precisa ser informado.')
        .bail()
        .isLength({ max: 1 })
        .withMessage('O sexo precisa ter apenas dois caracteres.'),

      check('naturalidade_estado').trim().not().isEmpty()
        .withMessage('O estado do paciente precisa ser informado.')
        .bail()
        .isLength({ min: 2, max: 2 })
        .withMessage('O estado precisa ter apenas 2 caracteres.'),

      check('naturalidade_cidade').trim().not().isEmpty()
        .withMessage('A cidade do paciente precisa ser informada.')
        .bail()
        .isLength({ min: 3, max: 45 })
        .withMessage('A cidade precisa ter entre 3 e 45 caracteres.'),
    ];
  }

  static removeValidations() {
    return [
      check('idPaciente').trim().not().isEmpty()
        .withMessage('O ID do Paciente precisa ser informado.')
        .bail()
        .isInt()
        .withMessage('O ID precisa ser um número inteiro'),
    ];
  }

  static updateValidations() {
    return this.validations().concat(this.removeValidations());
  }
}

export default PacienteModel;
