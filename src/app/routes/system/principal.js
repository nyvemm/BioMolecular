const database = require('../../../config/database/connection');
const dateUtils = require('../../../utils/date');
const { loggedIn, visitanteLogin } = require('../../helpers/login');

const { viewDateFormat } = dateUtils;
const objError = { status: 'error' };

async function getData() {
  try {
    const nPacientes = await database('paciente')
      .select()
      .count({ count: '*' });
    const nExames = await database('exame').select().count({ count: '*' });
    const nSolicitantes = await database('solicitante')
      .select()
      .count({ count: '*' });
    const nAmostras = await database('amostra').select().count({ count: '*' });
    const nAmostrasP = await database('amostra')
      .select()
      .where('status_pedido', 'Parcialmente avaliado')
      .count({ count: '*' });
    const nAmostrasNA = await database('amostra')
      .select()
      .where('status_pedido', 'Não avaliado')
      .count({ count: '*' });

    return {
      pacientes: nPacientes[0].count,
      exames: nExames[0].count,
      solicitantes: nSolicitantes[0].count,
      amostras: nAmostras[0].count,
      amostrasP: nAmostrasP[0].count,
      amostrasNA: nAmostrasNA[0].count
    };
  } catch (error) {
    return objError;
  }
}

async function getProximasAmostras() {
  try {
    const amostras = await database('amostra')
      .whereIn('status_pedido', ['Não avaliado', 'Parcialmente avaliado'])
      .innerJoin(
        'solicitante',
        'solicitante.idSolicitante',
        'amostra.idSolicitante'
      )
      .orderBy('amostra.cadastrado_em', 'desc')
      .limit(5)
      .select();

    for (let i = 0; i < amostras.length; i += 1) {
      amostras[i].em_analise =
        amostras[i].status_pedido === 'Parcialmente avaliado';
      amostras[i].f_cadastrado_em = viewDateFormat(amostras[i].cadastrado_em);
    }

    return amostras;
  } catch (error) {
    return objError;
  }
}

module.exports = (app) => {
  app.get('/', (req, res) => {
    if (req.user && !req.user.solicitante) res.redirect('/dashboard');
    else if (req.user && req.user.solicitante) res.redirect('/visitante');
    else res.redirect('/login');
  });

  // Tela principal
  app.get('/dashboard', loggedIn, (req, res) => {
    getData().then((dataContador) => {
      getProximasAmostras().then((amostras) => {
        res.render('main/', {
          contador: dataContador,
          amostras
        });
      });
    });
  });

  // Solicitantes
  app.get('/visitante', visitanteLogin, (req, res) => {
    // Pega o solicitante pelo login do usuário.
    database('solicitante')
      .where('login_visitante', req.user.login)
      .select('idSolicitante')
      .first()
      .then((solicitante) => {
        // Pega as amostras pelo id do solicitante.
        database('amostra')
          .where('amostra.idSolicitante', solicitante.idSolicitante)
          .innerJoin('paciente', 'amostra.idPaciente', 'paciente.idPaciente')
          .innerJoin(
            'solicitante',
            'amostra.idSolicitante',
            'solicitante.idSolicitante'
          )
          .select(
            database.raw(
              '*, paciente.nome as paciente_nome, solicitante.nome as solicitante_nome, amostra.observacao as observacao'
            )
          )
          .then((amostrasData) => {
            const amostras = amostrasData;
            // Formata o valor da data.
            for (let i = 0; i < amostras.length; i += 1) {
              const diffTime = Math.abs(new Date() - amostras[i].dt_nasc);
              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
              amostras[i].idade = Math.floor(diffDays / 365);
              amostras[i].idade_meses = Math.floor((diffDays % 365) / 30);
              amostras[i].f_dt_recebimento = viewDateFormat(
                amostras[i].dt_recebimento
              );
              amostras[i].f_dt_coleta = viewDateFormat(amostras[i].dt_coleta);
              amostras[i].f_dt_solicitacao = viewDateFormat(
                amostras[i].dt_solicitacao
              );
              amostras[i].medicamentos =
                JSON.parse(amostras[i].medicamentos).length > 0
                  ? JSON.parse(amostras[i].medicamentos).split(',')
                  : null;

              amostras[i].f_dt_coleta = viewDateFormat(amostras[i].dt_coleta);
              amostras[i].cadastrado_em = viewDateFormat(
                amostras[i].cadastrado_em
              );
              amostras[i].f_dt_recebimento = viewDateFormat(
                amostras[i].dt_recebimento
              );
              amostras[i].f_dt_solicitacao = viewDateFormat(
                amostras[i].dt_solicitacao
              );
              amostras[i].f_dt_coleta = viewDateFormat(amostras[i].dt_coleta);
              amostras[i].f_dt_ult_transfusao = viewDateFormat(
                amostras[i].dt_ult_transfusao
              );
              amostras[i].finalizado =
                amostras[i].status_pedido === 'Finalizado';

              /* Idade do Paciente */
              if (amostras[i].dt_coleta) {
                const diffTimeColeta = Math.abs(
                  amostras[i].dt_coleta - amostras[i].dt_nasc
                );
                const diffDaysColeta = Math.floor(
                  diffTimeColeta / (1000 * 60 * 60 * 24)
                );
                amostras[i].idade_coleta = Math.floor(diffDaysColeta / 365);
                amostras[i].idade_coleta_meses = Math.floor(
                  (diffDaysColeta % 365) / 30
                );
              }

              database('amostra_contem_exames_aux')
                .where('idAmostra', amostras[i].idAmostra)
                .innerJoin(
                  'exame',
                  'amostra_contem_exames_aux.idExame',
                  'exame.idExame'
                )
                .select()
                .then((exame) => {
                  let cont = 0;
                  exame.forEach((currentExame) => {
                    if (currentExame.status) cont += 1;
                  });
                  amostras[i].exames = exame;
                  amostras[i].total_exames = exame.length;
                  amostras[i].exames_realizados = cont;

                  res.render('solicitantes/visitante', {
                    amostras,
                    qtdAmostras: amostras.length
                  });
                })
                .catch((error) => {
                  res.render('layouts/fatal_error', { error });
                });
            }
          })
          .catch((error) => {
            res.render('layouts/fatal_error', { error });
          });
      })
      .catch((error) => {
        res.render('layouts/fatal_error', { error });
      });
  });
};
