const UsuarioDAO = require('../../dao/usuarioDAO');
const { loggedIn } = require('../../helpers/login');

module.exports = (app, database) => {
  const DAOUsuario = new UsuarioDAO(database);
  app.get('/meu-perfil', loggedIn, (req, res) => {
    try {
      req.user.foto = req.user.foto ? req.user.foto : '/img/sem-foto.png';
      res.render('usuarios/meu-perfil', { usuario: req.user });
    } catch (error) {
      res.render('layouts/fatal_error', { error });
    }
  });

  app.get('/administrador', loggedIn, (req, res) => {
    try {
      DAOUsuario.getUsuarios().then((usuarios) => {
        const usuariosData = usuarios;
        for (let i = 0; i < usuariosData.length; i += 1) {
          usuariosData[i].foto = usuariosData[i].foto
            ? usuariosData[i].foto
            : '/img/sem-foto.png';
        }
        res.render('usuarios/administrador', { data: usuariosData });
      });
    } catch (error) {
      res.render('layouts/fatal_error', { error });
    }
  });

  app.get('/administrador/cadastrar-usuario', loggedIn, (req, res) => {
    res.render('usuarios/cadastrar');
  });
};
