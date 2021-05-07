import { validationResult } from 'express-validator';

class exameController {
  constructor(DAOExame) {
    this.DAOExame = DAOExame;
  }

  static routes() {
    return {
      base: '/exame/',
      getId: '/exame/:id',
    };
  }

  all() {
    const { DAOExame } = this;
    return async function getAllExame(req, res) {
      const queryData = req.query;
      await DAOExame.getExames(queryData)
        .then((data) => res.json(data))
        .catch((error) => res.json(error));
    };
  }

  get() {
    const { DAOExame } = this;
    return async function getIDExame(req, res) {
      const { id } = req.params;
      await DAOExame.getExame(id)
        .then((data) => res.json(data))
        .catch((error) => res.json(error));
    };
  }

  insert() {
    const { DAOExame } = this;
    return async function InsertExame(req, res) {
      // Recebe os erros de validação da requisição.
      const validation = validationResult(req);

      if (validation.array().length !== 0) {
        res.json({ status: 'error', message: validation.errors });
      } else {
        const bodyData = req.body;
        await DAOExame.addExame(bodyData)
          .then((data) => res.json(data))
          .catch((error) => res.json(error));
      }
    };
  }

  update() {
    const { DAOExame } = this;
    return async function updateExame(req, res) {
      // Recebe os erros de validação da requisição.
      const validation = validationResult(req);

      if (validation.array().length !== 0) {
        res.json({ status: 'error', message: validation.errors });
      } else {
        const bodyData = req.body;
        await DAOExame.updateExame(bodyData)
          .then((data) => res.json(data))
          .catch((error) => res.json(error));
      }
    };
  }

  delete() {
    const { DAOExame } = this;
    return async function deleteExame(req, res) {
      const { id } = req.query;
      await DAOExame.deleteExame(id)
        .then((data) => res.json(data))
        .catch((error) => res.json(error));
    };
  }
}

export default exameController;
