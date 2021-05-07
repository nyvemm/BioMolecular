/* eslint-disable import/extensions */
import AmostraDAO from '../../dao/amostraDAO.js';

// Bibliotecas internas
import dateUtils from '../../../utils/date.js';
import { loggedIn } from '../../helpers/login.js';

const { viewDateFormat } = dateUtils;
const { inputDateFormat } = dateUtils;

const objError = { status: 'error' };
const objSuccess = { status: 'success' };

export default (app, database) => {
  const DAOAmostra = new AmostraDAO(database);

  /* Resultados */
  app.get('/resultados/:id', (req, res) => {
    database('resultados').select().where('amostra_contem_exames_aux.idAmostra', req.params.id)
      .innerJoin('amostra_contem_exames_aux', 'amostra_contem_exames_aux.idAmostraExame', 'resultados.idAmostraExame')
      .then((data) => {
        res.json(data);
      })
      .catch(() => {
        res.json(objError);
      });
  });

  /* Atualizar Resultados de uma amostra */
  app.put('/amostra-resultados', (req, res) => {
    const id = req.body ? req.body.idAmostra : null;

    database('amostra').where('idAmostra', id).update({
      interpretacao_resultados:
        req.body.interpretacao_resultados ? req.body.interpretacao_resultados : null,
      resultado: req.body.resultado ? req.body.resultado : null,
    }).then(() => {
      res.json(objSuccess);
    })
      .catch(() => {
        res.json(objError);
      });
  });

  app.delete('/resultados/:id', (req, res) => {
    const { id } = req.params;
    database('resultados').where('idResultado', id).del().then(() => {
      res.json(objSuccess);
    })
      .catch(() => {
        res.json(objError);
      });
  });

  app.get('/submeter-resultado/:id', (req, res) => {
    const { id } = req.params;
    database('resultados').where('idAmostraExame', id).select().then((resultados) => {
      database('amostra_contem_exames_aux').where('idAmostraExame', id).update({
        status: resultados.length > 0,
        liberado_em: resultados.length ? new Date() : null,
      }).then(() => {
        /* Pega o ID da Amostra */
        database('amostra_contem_exames_aux').where('idAmostraExame', id)
          .select('idAmostra').then((idAmostra) => {
            /* Pega a lista de todos os exames */
            database('amostra_contem_exames_aux').where('idAmostra', idAmostra[0].idAmostra)
              .select().then((amostras) => {
                /* Pega a lista de amostras finalizadas */
                try {
                  const finalizadas = amostras.filter((amEx) => amEx.status);
                  let FinalStatus = '';

                  if (finalizadas.length === amostras.length) {
                    FinalStatus = 'Finalizado';
                  } else if (finalizadas.length >= 1) {
                    FinalStatus = 'Parcialmente avaliado';
                  } else {
                    FinalStatus = 'Não avaliado';
                  }
                  /* Seta o resultado na amostra */
                  database('amostra').update({ status_pedido: FinalStatus, dt_liberacao: new Date() })
                    .where('idAmostra', idAmostra[0].idAmostra)
                    .then(() => {
                      res.json(objSuccess);
                    })
                    .catch(() => {
                      res.json(objError);
                    });
                } catch (error) {
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
      })
        .catch(() => {
          res.json(objError);
        });
    })
      .catch(() => {
        res.json(objError);
      });
  });

  app.post('/resultados/', (req, res) => {
    const data = req.body;
    database('resultados').insert({
      idAmostraExame: data.idAmostraExame,
      valor_resultado: data.valor_resultado,
      observacao_resultado: data.observacao_resultado,
    }).then(() => {
      res.json(objSuccess);
    }).catch(() => {
      res.json(objError);
    });
  });

  app.get('/amostras', loggedIn, (req, res) => {
    res.render('amostras/');
  });

  app.get('/amostras/:id', loggedIn, (req, res) => {
    DAOAmostra.getAmostra(req.params.id).then((data) => {
      try {
        const amostraAtual = data[0];
        amostraAtual.cadastrado_em = viewDateFormat(amostraAtual.cadastrado_em);
        amostraAtual.f_dt_recebimento = viewDateFormat(amostraAtual.dt_recebimento);
        amostraAtual.f_dt_solicitacao = viewDateFormat(amostraAtual.dt_solicitacao);
        amostraAtual.f_dt_coleta = viewDateFormat(amostraAtual.dt_coleta);
        amostraAtual.f_dt_ult_transfusao = viewDateFormat(amostraAtual.dt_ult_transfusao);
        amostraAtual.finalizado = amostraAtual.status_pedido === 'Finalizado';

        /* Idade do Paciente */
        if (amostraAtual.dt_coleta) {
          const diffTime = Math.abs(amostraAtual.dt_coleta - amostraAtual.dt_nasc);
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          amostraAtual.idade_coleta = Math.floor(diffDays / 365);
          amostraAtual.idade_coleta_meses = Math.floor((diffDays % 365) / 30);
        }

        database('amostra_contem_exames_aux').select().where('idAmostra', req.params.id)
          .innerJoin('exame', 'amostra_contem_exames_aux.idExame', 'exame.idExame')
          .then((exame) => {
            let cont = 0;
            const exameAtual = exame;
            exameAtual.forEach((currentExame) => {
              if (currentExame.status) cont += 1;
            });

            exameAtual.total_exames = exame.length;
            exameAtual.exames_realizados = cont;
            res.render('amostras/visualizar', { data: amostraAtual, exame: exameAtual });
          })
          .catch((error) => {
            res.render('layouts/fatal_error', { error });
          });
      } catch (error) {
        res.render('layouts/fatal_error', { error });
      }
    }).catch((error) => {
      res.render('layouts/fatal_error', { error });
    });
  });

  app.get('/editar-amostra/:id', loggedIn, (req, res) => {
    DAOAmostra.getAmostra(req.params.id).then((data) => {
      try {
        const amostraAtual = data[0];
        amostraAtual.cadastrado_em = inputDateFormat(amostraAtual.cadastrado_em);
        amostraAtual.dt_recebimento = inputDateFormat(amostraAtual.dt_recebimento);
        amostraAtual.dt_solicitacao = inputDateFormat(amostraAtual.dt_solicitacao);
        amostraAtual.dt_coleta = inputDateFormat(amostraAtual.dt_coleta);
        amostraAtual.dt_ult_transfusao = inputDateFormat(amostraAtual.dt_ult_transfusao);
        amostraAtual.medicamentos = amostraAtual.medicamentos && JSON.parse(amostraAtual.medicamentos).length > 0 ? JSON.parse(amostraAtual.medicamentos).split(',') : null;

        database('amostra_contem_exames_aux').select().where('idAmostra', req.params.id)
          .innerJoin('exame', 'amostra_contem_exames_aux.idExame', 'exame.idExame')
          .then((exame) => {
            let cont = 0;
            const exameAtual = exame;
            exameAtual.forEach((currentExame) => {
              if (currentExame.status) cont += 1;
            });
            exameAtual.total_exames = exame.length;
            exameAtual.exames_realizados = cont;

            res.render('amostras/editar', { data: amostraAtual, exame: exameAtual });
          })
          .catch((error) => {
            res.render('layouts/fatal_error', { error });
          });
      } catch (error) {
        res.render('layouts/fatal_error', { error });
      }
    });
  });

  app.get('/cadastrar-resultado/:id', loggedIn, (req, res) => {
    database('amostra_contem_exames_aux').select(database.raw('*, exame.nome as exame_nome, paciente.nome as paciente_nome, amostra.observacao as observacao'))
      .where('amostra.idAmostra', req.params.id)
      .innerJoin('exame', 'amostra_contem_exames_aux.idExame', 'exame.idExame')
      .innerJoin('amostra', 'amostra.idAmostra', 'amostra_contem_exames_aux.idAmostra')
      .innerJoin('paciente', 'paciente.idPaciente', 'amostra.idPaciente')
      .then((exames) => {
        let cont = 0;
        const data = {};

        exames.forEach((currentExame) => { if (currentExame.status) cont += 1; });

        data.total_exames = exames.length;
        data.exames_realizados = cont;
        data.idAmostra = req.params.id;
        data.status_pedido = exames[0].status_pedido;

        database('amostra_contem_exames_aux').select('tipo_analise').distinct().where('idAmostra', req.params.id)
          .innerJoin('exame', 'amostra_contem_exames_aux.idExame', 'exame.idExame')
          .then((tiposExames) => {
            try {
              data.exames = [];

              const listaExames = tiposExames.map((t) => t.tipo_analise);
              listaExames.forEach((tipoExame) => {
                data.exames.push({ tipo: tipoExame, valor: [] });
              });

              exames.forEach((exame) => {
                const exameAtual = exame;
                exameAtual.liberado_em = viewDateFormat(exameAtual.liberado_em);
                const intervaloValor = exameAtual.tabela_intervalo && exameAtual.tabela_intervalo !== '' ? JSON.parse(exameAtual.tabela_intervalo) : null;

                const diffTime = Math.abs(exameAtual.dt_coleta - exameAtual.dt_nasc);
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                exameAtual.idade_coleta = Math.floor(diffDays / 365);
                exameAtual.idade_coleta_meses = Math.floor((diffDays % 365) / 30);
                exameAtual.intervalo_bool = exameAtual.tipo_valor_ref === 'Idade';
                exameAtual.intervalo_certo = `Não há valor de referência cadastrado para essa idade ${exameAtual.idade_coleta}a ${exameAtual.idade_coleta_meses}m.`;

                if (intervaloValor) {
                  intervaloValor.forEach((it) => {
                    if (it.idade.startsWith('>')) {
                      if (exameAtual.idade_coleta > parseInt(it.idade.substring(1), 10)) {
                        exameAtual.intervalo_certo = it.valor;
                      }
                    } else if (it.idade.startsWith('<')) {
                      if (exameAtual.idade_coleta < parseInt(it.idade.substring(1), 10)) {
                        exameAtual.intervalo_certo = it.valor;
                      }
                    } else if (it.idade.indexOf('-') !== -1) {
                      if (parseInt(it.idade.substring(0, it.idade.indexOf('-')) <= exameAtual.idade_coleta && exameAtual.idade_coleta <= parseInt(it.idade.substring(it.idade.indexOf('-') + 1), 10), 10)) {
                        exameAtual.intervalo_certo = it.valor;
                      }
                    } else if (parseInt(it.idade, 10) === exameAtual.idade_coleta) {
                      exameAtual.intervalo_certo = it.valor;
                    }
                  });
                }
                const tipo = exameAtual.tipo_analise;
                data.exames[listaExames.findIndex((elem) => elem === tipo)].valor.push(exameAtual);
              });
              res.render('amostras/resultados', { data, amostra: exames[0] });
            } catch (error) {
              res.render('layouts/fatal_error', { error });
            }
          });
      })
      .catch((error) => {
        res.render('layouts/fatal_error', { error });
      });
  });

  app.get('/cadastrar-amostra', loggedIn, (req, res) => {
    res.render('amostras/cadastrar');
  });

  app.get('/amostra-exames', loggedIn, (req, res) => {
    const { id } = req.query;
    database('amostra_contem_exames_aux').where('idAmostra', id).then((data) => {
      res.json(data);
    }).catch(() => {
      res.json(objError);
    });
  });
};
