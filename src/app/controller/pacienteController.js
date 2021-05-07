import { validationResult } from 'express-validator';

class pacienteController {
  constructor(DAOPaciente) {
    this.DAOPaciente = DAOPaciente;
  }

  static routes() {
    return {
      base: '/paciente/',
      getId: '/paciente/:id',
    };
  }

  all() {
    const { DAOPaciente } = this;
    return async function getAllPaciente(req, res) {
      const queryData = req.query;
      await DAOPaciente.getPacientes(queryData)
        .then((data) => res.json(data))
        .catch((error) => res.json(error));
    };
  }

  get() {
    const { DAOPaciente } = this;
    return async function getIDPaciente(req, res) {
      const { id } = req.params;
      await DAOPaciente.getPaciente(id)
        .then((data) => res.json(data))
        .catch((error) => res.json(error));
    };
  }

  insert() {
    const { DAOPaciente } = this;
    return async function insertPaciente(req, res) {
      // Recebe os erros de validação da requisição.
      const validation = validationResult(req);
      if (validation.array().length !== 0) {
        res.json({ status: 'error', message: validation.errors });
      } else {
        const bodyData = req.body;
        await DAOPaciente.addPaciente(bodyData)
          .then((data) => res.json(data))
          .catch((error) => res.json(error));
      }
    };
  }

  update() {
    const { DAOPaciente } = this;
    return async function updatePaciente(req, res) {
      // Recebe os erros de validação da requisição.
      const validation = validationResult(req);

      if (validation.array().length !== 0) {
        res.json({ status: 'error', message: validation.errors });
      } else {
        const bodyData = req.body;
        await DAOPaciente.updatePaciente(bodyData)
          .then((data) => res.json(data))
          .catch((error) => res.json(error));
      }
    };
  }

  delete() {
    const { DAOPaciente } = this;
    return async function deletePaciente(req, res) {
      const { id } = req.query;
      await DAOPaciente.deletePaciente(id)
        .then((data) => res.json(data))
        .catch((error) => res.json(error));
    };
  }
}

export default pacienteController;
