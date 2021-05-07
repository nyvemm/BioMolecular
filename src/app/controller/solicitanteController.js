import { validationResult } from 'express-validator';

class solicitanteController {
  constructor(DAOSolicitante) {
    this.DAOSolicitante = DAOSolicitante;
  }

  static routes() {
    return {
      base: '/solicitante/',
      getLogin: '/solicitante/:id',
    };
  }

  all() {
    const { DAOSolicitante } = this;
    return async function getAllSolicitantes(req, res) {
      const queryData = req.query;
      await DAOSolicitante.getSolicitantes(queryData)
        .then((data) => res.json(data))
        .catch((error) => res.json(error));
    };
  }

  get() {
    const { DAOSolicitante } = this;
    return async function getIDSolicitanteF(req, res) {
      const { id } = req.params;
      await DAOSolicitante.getSolicitante(id)
        .then((data) => res.json(data))
        .catch((error) => res.json(error));
    };
  }

  insert() {
    const { DAOSolicitante } = this;
    return async function insertSolicitante(req, res) {
      // Recebe os erros de validação da requisição.
      const validation = validationResult(req);

      if (validation.array().length !== 0) {
        res.json({ status: 'error', message: validation.errors });
      } else {
        const bodyData = req.body;
        await DAOSolicitante.addSolicitante(bodyData)
          .then((data) => res.json(data))
          .catch((error) => res.json(error));
      }
    };
  }

  update() {
    const { DAOSolicitante } = this;
    return async function updateSolicitante(req, res) {
      // Recebe os erros de validação da requisição.
      const validation = validationResult(req);

      if (validation.array().length !== 0) {
        res.json({ status: 'error', message: validation.errors });
      } else {
        const bodyData = req.body;
        await DAOSolicitante.updateSolicitante(bodyData)
          .then((data) => res.json(data))
          .catch((error) => res.json(error));
      }
    };
  }

  delete() {
    const { DAOSolicitante } = this;
    return async function deleteSolicitante(req, res) {
      const { id } = req.query;
      await DAOSolicitante.removeSolicitante(id)
        .then((data) => res.json(data))
        .catch((error) => res.json(error));
    };
  }
}

export default solicitanteController;
