/* eslint-disable import/extensions */
import ExameDAO from '../../dao/exameDAO.js';

// Bibliotecas internas
import dateUtils from '../../../utils/date.js';
import { loggedIn } from '../../helpers/login.js';

const { viewDateFormat } = dateUtils;
const { inputDateFormat } = dateUtils;

export default (app, database) => {
  const DAOExame = new ExameDAO(database);

  app.get('/exames', loggedIn, (req, res) => {
    res.render('exames/');
  });

  app.get('/editar-exame/:id', loggedIn, (req, res) => {
    DAOExame.getExame(req.params.id).then((data) => {
      try {
        const exameAtual = data[0];
        exameAtual.cadastrado_em = inputDateFormat(exameAtual.cadastrado_em);

        let intervalo = null;
        if (exameAtual.tabela_intervalo != null && exameAtual.tabela_intervalo !== '') {
          intervalo = JSON.parse(exameAtual.tabela_intervalo);
        }

        res.render('exames/editar', { data: exameAtual, intervalo });
      } catch (error) {
        res.render('layouts/fatal_error', { error });
      }
    })
      .catch((error) => {
        res.render('layouts/fatal_error', { error });
      });
  });

  app.get('/exames/:id', loggedIn, (req, res) => {
    DAOExame.getExame(req.params.id).then((data) => {
      try {
        const exameAtual = data[0];
        exameAtual.cadastrado_em = viewDateFormat(exameAtual.cadastrado_em);

        let intervalo = null;
        if (exameAtual.tabela_intervalo != null && exameAtual.tabela_intervalo !== '') {
          intervalo = JSON.parse(exameAtual.tabela_intervalo);
        }

        res.render('exames/visualizar', { data: exameAtual, intervalo });
      } catch (error) {
        res.render('layouts/fatal_error', { error });
      }
    })
      .catch((error) => {
        res.render('layouts/fatal_error', { error });
      });
  });

  app.get('/cadastrar-exame', loggedIn, (req, res) => {
    res.render('exames/cadastrar');
  });
};
