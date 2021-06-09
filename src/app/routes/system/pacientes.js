const PacienteDAO = require('../../dao/pacienteDAO.js');

// Bibliotecas internas
const dateUtils = require('../../../utils/date.js');
const { loggedIn } = require('../../helpers/login.js');

const { viewDateFormat } = dateUtils;
const { inputDateFormat } = dateUtils;

module.exports = (app, database) => {
  const DAOPaciente = new PacienteDAO(database);

  app.get('/pacientes', loggedIn, (req, res) => {
    res.render('pacientes/');
  });

  app.get('/pacientes/:id', loggedIn, (req, res) => {
    DAOPaciente.getPaciente(req.params.id)
      .then((data) => {
        try {
          const pacienteAtual = data[0];

          pacienteAtual.dt_nasc = viewDateFormat(pacienteAtual.dt_nasc);
          pacienteAtual.cadastrado_em = viewDateFormat(
            pacienteAtual.cadastrado_em
          );
          pacienteAtual.sexo =
            pacienteAtual.sexo === 'M' ? 'Masculino' : 'Feminino';
          res.render('pacientes/visualizar', { data: pacienteAtual });
        } catch (error) {
          res.render('layouts/fatal_error', { error });
        }
      })
      .catch((error) => {
        res.render('layouts/fatal_error', { error });
      });
  });

  app.get('/editar-paciente/:id', loggedIn, (req, res) => {
    DAOPaciente.getPaciente(req.params.id)
      .then((data) => {
        try {
          const pacienteAtual = data[0];
          pacienteAtual.dt_nasc = inputDateFormat(pacienteAtual.dt_nasc);
          pacienteAtual.cadastrado_em = inputDateFormat(
            pacienteAtual.cadastrado_em
          );
          res.render('pacientes/editar', { data: pacienteAtual });
        } catch (error) {
          res.render('layouts/fatal_error', { error });
        }
      })
      .catch((error) => {
        res.render('layouts/fatal_error', { error });
      });
  });

  app.get('/cadastrar-paciente', loggedIn, (req, res) => {
    res.render('pacientes/cadastrar');
  });
};
