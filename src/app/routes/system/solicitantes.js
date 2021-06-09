const passGenerator = require('generate-password');
const SolicitanteDAO = require('../../dao/solicitanteDAO');

// Bibliotecas internas
const dateUtils = require('../../../utils/date');
const { loggedIn } = require('../../helpers/login');

// Tratamento de exceções
const objSuccess = { status: 'success' };
const objError = { status: 'error' };

const { viewDateFormat } = dateUtils;
const { inputDateFormat } = dateUtils;

async function updateAuthSolicitante(data, database) {
  try {
    /* Lista de valores válidos */
    let listValidLogin = await database('solicitante')
      .select('login_visitante')
      .whereNotNull('login_visitante');
    listValidLogin = listValidLogin.map((x) => x.login_visitante.split('.')[1]);

    /* Gera um identificador que não se repete */
    let loginNum;
    do {
      loginNum = passGenerator.generate({
        length: 5,
        numbers: true,
        uppercase: false
      });
    } while (listValidLogin.includes(loginNum));

    /* Novos Valores */
    const loginVisitante = `${data.nome
      .split(' ')[0]
      .replaceAll('.', '')
      .toLowerCase()}.${loginNum}`;
    const senhaVisitante = passGenerator.generate({ length: 8, numbers: true });

    /* Apaga o usuário no login */
    await database('usuario')
      .where('login', data.login_visitante)
      .first()
      .delete();

    /* Adiciona um novo usuário baseado no solicitante. */
    await database('usuario').insert({
      login: loginVisitante,
      senha: senhaVisitante,
      nome: data.nome,
      email: data.e_mail,
      administrador: false,
      foto: null,
      solicitante: true
    });

    /* Atualiza o solicitante */
    await database('solicitante')
      .where('idSolicitante', data.idSolicitante)
      .update({
        login_visitante: loginVisitante,
        senha_visitante: senhaVisitante
      });

    return {
      status: objSuccess.status,
      login: loginVisitante,
      senha: senhaVisitante
    };
  } catch (error) {
    throw new Error();
  }
}

module.exports = (app, database) => {
  const DAOSolicitante = new SolicitanteDAO(database);

  app.get('/solicitantes', loggedIn, (req, res) => {
    res.render('solicitantes/');
  });

  app.get('/editar-solicitante/:id', loggedIn, (req, res) => {
    DAOSolicitante.getSolicitante(req.params.id)
      .then((data) => {
        try {
          const solicitanteAtual = data[0];
          solicitanteAtual.cadastrado_em = inputDateFormat(
            solicitanteAtual.cadastrado_em
          );
          res.render('solicitantes/editar', { data: solicitanteAtual });
        } catch (error) {
          res.render('layouts/fatal_error', { error });
        }
      })
      .catch((error) => {
        res.render('layouts/fatal_error', { error });
      });
  });

  app.get('/solicitantes/:id', loggedIn, (req, res) => {
    DAOSolicitante.getSolicitante(req.params.id)
      .then((data) => {
        try {
          const solicitanteAtual = data[0];
          solicitanteAtual.cadastrado_em = viewDateFormat(
            solicitanteAtual.cadastrado_em
          );
          res.render('solicitantes/visualizar', { data: solicitanteAtual });
        } catch (error) {
          res.render('layouts/fatal_error', { error });
        }
      })
      .catch((error) => {
        res.render('layouts/fatal_error', { error });
      });
  });

  app.get('/cadastrar-solicitante', loggedIn, (req, res) => {
    res.render('solicitantes/cadastrar');
  });

  app.put('/mudar-login-solicitante', (req, res) => {
    const id = req.body ? req.body.idSolicitante : null;
    database('solicitante')
      .where('idSolicitante', id)
      .first()
      .then((solicitante) => {
        updateAuthSolicitante(solicitante, database)
          .then((obj) => {
            if (obj.status === 'success') {
              res.json(obj);
            } else {
              res.json(objError);
            }
          })
          .catch(() => {
            res.json(objError);
          });
      })
      .catch(() => {
        res.json(objError);
      });
  });
};
