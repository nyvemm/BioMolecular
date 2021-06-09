const { validationResult } = require('express-validator');

class usuarioController {
  constructor(DAOUsuario) {
    this.DAOUsuario = DAOUsuario;
  }

  static routes() {
    return {
      base: '/usuario/',
      getLogin: '/usuario/:login',
    };
  }

  all() {
    const { DAOUsuario } = this;
    return async function getAllUsuarios(req, res) {
      await DAOUsuario.getUsuarios()
        .then((data) => res.json(data))
        .catch((error) => res.json(error));
    };
  }

  get() {
    const { DAOUsuario } = this;
    return async function getIDUsuario(req, res) {
      const { login } = req.params;
      await DAOUsuario.getUsuario(login)
        .then((data) => res.json(data))
        .catch((error) => res.json(error));
    };
  }

  insert() {
    const { DAOUsuario } = this;
    return async function insertUsuario(req, res) {
      // Recebe os erros de validação da requisição.
      const validation = validationResult(req);

      if (validation.array().length !== 0) {
        res.json({ status: 'error', message: validation.errors });
      } else {
        const bodyData = req.body;
        await DAOUsuario.addUsuario(bodyData)
          .then((data) => res.json(data))
          .catch((error) => res.json(error));
      }
    };
  }

  update() {
    const { DAOUsuario } = this;
    return async function updateUsuario(req, res) {
      // Recebe os erros de validação da requisição.
      const validation = validationResult(req);

      if (validation.array().length !== 0) {
        res.json({ status: 'error', message: validation.errors });
      } else {
        const bodyData = req.body;
        bodyData.foto = req.file ? `/uploads/image/${req.file.filename}` : null;
        if (bodyData.foto == null) {
          bodyData.foto = req.user.foto;
        }

        await DAOUsuario.updateUsuario(bodyData)
          .then((data) => res.json(data))
          .catch((error) => res.json(error));
      }
    };
  }

  delete() {
    const { DAOUsuario } = this;
    return async function deleteUsuario(req, res) {
      const { login } = req.query;
      await DAOUsuario.removeUsuario(login)
        .then((data) => res.json(data))
        .catch((error) => res.json(error));
    };
  }
}

module.exports =  usuarioController;
