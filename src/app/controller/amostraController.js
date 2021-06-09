const { validationResult } = require('express-validator');

class amostraController {
  constructor(DAOAmostra) {
    this.DAOAmostra = DAOAmostra;
  }

  static routes() {
    return {
      base: '/amostra/',
      getId: '/amostra/:idAmostra',
    };
  }

  all() {
    const { DAOAmostra } = this;
    return async function getAllAmostra(req, res) {
      const data = req.query;
      await DAOAmostra.getAmostras(data)
        .then((amostraData) => res.json(amostraData))
        .catch((error) => res.json(error));
    };
  }

  get() {
    const { DAOAmostra } = this;
    return async function getIDAmostra(req, res) {
      const id = req.params.idAmostra;
      await DAOAmostra.getAmostra(id)
        .then((amostraData) => res.json(amostraData))
        .catch((error) => res.json(error));
    };
  }

  insert() {
    const { DAOAmostra } = this;
    return async function insertAmostra(req, res) {
      // Recebe os erros de validação da requisição.
      const validation = validationResult(req);

      if (validation.array().length !== 0) {
        res.json({ status: 'error', message: validation.errors });
      } else {
        const data = req.body;
        await DAOAmostra.addAmostra(data)
          .then((amostraData) => res.json(amostraData))
          .catch((error) => res.json(error));
      }
    };
  }

  update() {
    const { DAOAmostra } = this;
    return async function updateAmostra(req, res) {
      const data = req.body;
      await DAOAmostra.updateAmostra(data)
        .then((amostraData) => res.json(amostraData))
        .catch((error) => res.json(error));
    };
  }

  delete() {
    const { DAOAmostra } = this;
    return async function deleteAmostra(req, res) {
      const { id } = req.query;
      await DAOAmostra.removeAmostra(id)
        .then((amostraData) => res.json(amostraData))
        .catch((error) => res.json(error));
    };
  }
}

module.exports =  amostraController;
