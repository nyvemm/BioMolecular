// Bibliotecas internas
const dateUtils = require('../../../utils/date');
const { loggedIn } = require('../../helpers/login');

const { viewDateFormat } = dateUtils;

const objError = { status: 'error' };

module.exports = (app, database) => {
  app.get('/relatorios', loggedIn, (req, res) => {
    database('amostra')
      .select(
        database.raw(
          '*, paciente.nome as paciente_nome, solicitante.nome as solicitante_nome'
        )
      )
      .innerJoin('paciente', 'amostra.idPaciente', 'paciente.idPaciente')
      .innerJoin(
        'solicitante',
        'amostra.idSolicitante',
        'solicitante.idSolicitante'
      )
      .orderBy('dt_coleta', 'desc')
      .then((amostra) => {
        try {
          const amostraAtual = amostra;
          for (let i = 0; i < amostra.length; i += 1) {
            amostraAtual[i].f_dt_recebimento = viewDateFormat(
              amostraAtual[i].dt_recebimento
            );
            amostraAtual[i].f_dt_coleta = viewDateFormat(
              amostraAtual[i].dt_coleta
            );
            amostraAtual[i].f_dt_solicitacao = viewDateFormat(
              amostraAtual[i].dt_solicitacao
            );
            amostraAtual[i].finalizado =
              amostraAtual[i].status_pedido === 'Finalizado';
            amostraAtual[i].em_analise =
              amostraAtual[i].status_pedido === 'Parcialmente avaliado';
            amostraAtual[i].cadastrado =
              amostraAtual[i].status_pedido === 'Não avaliado';
          }
          res.render('relatorios', { amostra });
        } catch (error) {
          res.render('layouts/fatal_error', { error });
        }
      })
      .catch((error) => {
        res.render('layouts/fatal_error', { error });
      });
  });

  /* Geração de Relatórios */
  app.get('/relatorios/laudo', loggedIn, (req, res) => {
    database('amostra')
      .select(
        database.raw(
          '*, paciente.nome as paciente_nome, solicitante.nome as solicitante_nome'
        )
      )
      .innerJoin('paciente', 'amostra.idPaciente', 'paciente.idPaciente')
      .innerJoin(
        'solicitante',
        'amostra.idSolicitante',
        'solicitante.idSolicitante'
      )
      .orderBy('dt_coleta', 'desc')
      .then((amostra) => {
        try {
          const amostraAtual = amostra;
          for (let i = 0; i < amostra.length; i += 1) {
            amostraAtual[i].f_dt_recebimento = viewDateFormat(
              amostraAtual[i].dt_recebimento
            );
            amostraAtual[i].f_dt_coleta = viewDateFormat(
              amostraAtual[i].dt_coleta
            );
            amostraAtual[i].f_dt_solicitacao = viewDateFormat(
              amostraAtual[i].dt_solicitacao
            );
            amostraAtual[i].finalizado =
              amostraAtual[i].status_pedido === 'Finalizado';
            amostraAtual[i].em_analise =
              amostraAtual[i].status_pedido === 'Parcialmente avaliado';
            amostraAtual[i].cadastrado =
              amostraAtual[i].status_pedido === 'Não avaliado';
          }
          res.render('relatorios/laudo', { amostra });
        } catch (error) {
          res.render('layouts/fatal_error', { error });
        }
      })
      .catch((error) => {
        res.render('layouts/fatal_error', { error });
      });
  });

  app.get('/relatorios/amostras-situacao', loggedIn, (req, res) => {
    database('amostra')
      .select('status_pedido')
      .distinct()
      .then((situacoes) => {
        try {
          res.render('relatorios/relatorio-situacao', {
            situacoes: situacoes.map((x) => x.status_pedido)
          });
        } catch (error) {
          res.render('layouts/fatal_error', { error });
        }
      })
      .catch((error) => {
        res.render('layouts/fatal_error', { error });
      });
  });

  app.get('/relatorios/amostras-material', loggedIn, (req, res) => {
    database('amostra')
      .select('material')
      .distinct()
      .then((materiais) => {
        try {
          res.render('relatorios/relatorio-material', {
            materiais: materiais.map((x) => x.material)
          });
        } catch (error) {
          res.render('layouts/fatal_error', { error });
        }
      })
      .catch((error) => {
        res.render('layouts/fatal_error', { error });
      });
  });

  app.get('/relatorios/amostras-tipo-exame', loggedIn, (req, res) => {
    database('amostra')
      .innerJoin(
        'amostra_contem_exames_aux',
        'amostra_contem_exames_aux.idAmostra',
        'amostra.idAmostra'
      )
      .innerJoin('exame', 'exame.idExame', 'amostra_contem_exames_aux.idExame')
      .select('tipo_analise')
      .distinct()
      .then((tipoAnalises) => {
        try {
          res.render('relatorios/relatorio-tipo-exame', {
            tipoAnalises: tipoAnalises.map((x) => x.tipo_analise)
          });
        } catch (error) {
          res.render('layouts/fatal_error', { error });
        }
      })
      .catch((error) => {
        res.render('layouts/fatal_error', { error });
      });
  });

  /* Geração de Laudo */
  app.get('/relatorios/imprimir-laudo', (req, res) => {
    const { id } = req.query;
    database('amostra_contem_exames_aux')
      .where('amostra_contem_exames_aux.idAmostra', id)
      .innerJoin(
        'amostra',
        'amostra.idAmostra',
        'amostra_contem_exames_aux.idAmostra'
      )
      .innerJoin('exame', 'exame.idExame', 'amostra_contem_exames_aux.idExame')
      .innerJoin('paciente', 'amostra.idPaciente', 'paciente.idPaciente')
      .innerJoin(
        'solicitante',
        'amostra.idSolicitante',
        'solicitante.idSolicitante'
      )
      .leftJoin(
        'resultados',
        'resultados.idAmostraExame',
        'amostra_contem_exames_aux.idAmostraExame'
      )
      .select(
        database.raw(
          '*, paciente.nome as paciente_nome, solicitante.nome as solicitante_nome, exame.nome as exame_nome, exame.observacao as exame_observacao'
        )
      )
      .then((amostra) => {
        try {
          const amostraData = amostra;
          for (let i = 0; i < amostraData.length; i += 1) {
            amostraData[i].f_dt_recebimento = viewDateFormat(
              amostraData[i].dt_recebimento
            );
            amostraData[i].f_dt_coleta = viewDateFormat(
              amostraData[i].dt_coleta
            );
            amostraData[i].f_dt_solicitacao = viewDateFormat(
              amostraData[i].dt_solicitacao
            );
            amostraData[i].f_dt_nasc = viewDateFormat(amostraData[i].dt_nasc);
            amostraData[i].f_dt_liberacao = viewDateFormat(
              amostraData[i].dt_liberacao
            );

            const diffTime = Math.abs(new Date() - amostraData.dt_nasc);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            amostraData.idade = Math.floor(diffDays / 365);
            amostraData.idade_meses = Math.floor((diffDays % 365) / 30);
            amostraData.cod = req.query.cod;
          }

          database('amostra_contem_exames_aux')
            .select('tipo_analise')
            .distinct()
            .where('idAmostra', id)
            .innerJoin(
              'exame',
              'amostra_contem_exames_aux.idExame',
              'exame.idExame'
            )
            .then((tiposExames) => {
              try {
                const resultadosExames = [];
                const listaExames = tiposExames.map((t) => t.tipo_analise);
                listaExames.forEach((tipoExame) => {
                  resultadosExames.push({ tipo: tipoExame, valor: [] });
                });

                for (let i = 0; i < amostraData.length; i += 1) {
                  amostraData[i].liberado_em = viewDateFormat(
                    amostraData[i].liberado_em
                  );
                  const tipo = amostraData[i].tipo_analise;
                  resultadosExames[
                    listaExames.findIndex((elem) => elem === tipo)
                  ].valor.push(amostraData[i]);
                }

                let novosExames = [];
                const tipos = [
                  'Análise Citológica',
                  'Análise Eletroforética',
                  'Análise Cromatográfica',
                  'Análise Molecular'
                ];

                let tiposIndex = 0;
                let lastIndex = tiposIndex;
                while (resultadosExames.length !== 0) {
                  for (let i = 0; i < resultadosExames.length; i += 1) {
                    if (resultadosExames[i].tipo === tipos[tiposIndex]) {
                      lastIndex = tiposIndex;
                      tiposIndex += 1;
                      novosExames.push(resultadosExames[i]);
                      resultadosExames.splice(i, 1);
                      break;
                    }
                  }
                  /* Não encontrou o resultado */
                  if (lastIndex === tiposIndex) {
                    tiposIndex += 1;
                    lastIndex = tiposIndex;
                  }
                }

                /* Acha o índices das análises cromatográficas */
                let index = 0;
                while (
                  index < novosExames.length &&
                  novosExames[index].tipo != 'Análise Cromatográfica'
                ) {
                  index++;
                }

                if (index < novosExames.length) {
                  /* Lista dos métodos de cada amostra */
                  const metodo = novosExames[index].valor
                    .map((exame) => exame.metodo)
                    .filter((value, index, self) => {
                      return self.indexOf(value) === index;
                    });

                  /* Cria o receptáculo para os métodos */
                  const templateMetodo = metodo.map((metodo) => {
                    return {
                      tipo: 'Análise Cromatográfica',
                      valor: []
                    };
                  });

                  /* Adiciona os exames no receptáculo dos métodos */
                  novosExames[index].valor.forEach((exame) => {
                    templateMetodo[metodo.indexOf(exame.metodo)].valor.push(
                      exame
                    );
                  });

                  novosExames.splice(index, 1, ...templateMetodo);
                }

                res.render('relatorios/a4', {
                  amostra: amostra[0],
                  exames: novosExames,
                  codigo: amostra[0].cod,
                  responsavel: req.query.responsavel,
                  crbio: req.query.crbio,
                  art: req.query.art
                });
              } catch (error) {
                res.render('layouts/fatal_error', {
                  error
                });
              }
            })
            .catch((error) => {
              res.render('layouts/fatal_error', {
                error
              });
            });
        } catch (error) {
          res.render('layouts/fatal_error', { error });
        }
      })
      .catch((error) => {
        res.render('layouts/fatal_error', { error });
      });
  });

  /* CRUD */
  app.get('/relatorios/gerar-laudo', loggedIn, (req, res) => {
    const { id } = req.query;
    database('amostra_contem_exames_aux')
      .where('amostra_contem_exames_aux.idAmostra', id)
      .innerJoin(
        'amostra',
        'amostra.idAmostra',
        'amostra_contem_exames_aux.idAmostra'
      )
      .innerJoin('exame', 'exame.idExame', 'amostra_contem_exames_aux.idExame')
      .leftJoin(
        'resultados',
        'resultados.idAmostraExame',
        'amostra_contem_exames_aux.idAmostraExame'
      )
      .select()
      .then((data) => {
        const amostraAtual = data;
        database('amostra_contem_exames_aux')
          .select('tipo_analise')
          .distinct()
          .where('idAmostra', id)
          .innerJoin(
            'exame',
            'amostra_contem_exames_aux.idExame',
            'exame.idExame'
          )
          .then((tiposExames) => {
            try {
              const resultadosExames = [];

              const listaExames = tiposExames.map((t) => t.tipo_analise);
              listaExames.forEach((tipoExame) => {
                resultadosExames.push({ tipo: tipoExame, valor: [] });
              });

              for (let i = 0; i < amostraAtual.length; i += 1) {
                amostraAtual[i].liberado_em = viewDateFormat(
                  amostraAtual[i].liberado_em
                );
                const tipo = amostraAtual[i].tipo_analise;
                resultadosExames[
                  listaExames.findIndex((elem) => elem === tipo)
                ].valor.push(amostraAtual[i]);
              }
              res.json(resultadosExames);
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
  });

  /* CRUD */
  app.get('/relatorios/gerar-amostras-situacao', loggedIn, (req, res) => {
    const { situacao } = req.query;
    database('amostra')
      .select(
        database.raw(
          '*, paciente.nome as paciente_nome, solicitante.nome as solicitante_nome'
        )
      )
      .innerJoin('paciente', 'amostra.idPaciente', 'paciente.idPaciente')
      .innerJoin(
        'solicitante',
        'amostra.idSolicitante',
        'solicitante.idSolicitante'
      )
      .where('status_pedido', situacao)
      .then((data) => {
        try {
          const amostraAtual = data;
          for (let i = 0; i < amostraAtual.length; i += 1) {
            amostraAtual[i].f_dt_coleta = viewDateFormat(
              amostraAtual[i].dt_coleta
            );
          }
          res.json(amostraAtual);
        } catch (error) {
          res.json(objError);
        }
      })
      .catch(() => {
        res.json(objError);
      });
  });

  /* CRUD */
  app.get('/relatorios/gerar-amostras-material', loggedIn, (req, res) => {
    const { material } = req.query;
    database('amostra')
      .select(
        database.raw(
          '*, paciente.nome as paciente_nome, solicitante.nome as solicitante_nome'
        )
      )
      .innerJoin('paciente', 'amostra.idPaciente', 'paciente.idPaciente')
      .innerJoin(
        'solicitante',
        'amostra.idSolicitante',
        'solicitante.idSolicitante'
      )
      .where('material', material)
      .then((data) => {
        try {
          const amostraAtual = data;
          for (let i = 0; i < amostraAtual.length; i += 1) {
            amostraAtual[i].f_dt_coleta = viewDateFormat(
              amostraAtual[i].dt_coleta
            );
          }
          res.json(amostraAtual);
        } catch (error) {
          res.json(objError);
        }
      })
      .catch(() => {
        res.json(objError);
      });
  });

  /* CRUD */
  app.get('/relatorios/gerar-amostras-tipo-exame', loggedIn, (req, res) => {
    const { tipo_analise } = req.query;
    database('amostra')
      .distinct()
      .select(
        database.raw(
          'amostra.idAmostra, material, dt_coleta, paciente.nome as paciente_nome, solicitante.nome as solicitante_nome'
        )
      )
      .innerJoin('paciente', 'amostra.idPaciente', 'paciente.idPaciente')
      .innerJoin(
        'solicitante',
        'amostra.idSolicitante',
        'solicitante.idSolicitante'
      )
      .innerJoin(
        'amostra_contem_exames_aux',
        'amostra_contem_exames_aux.idAmostra',
        'amostra.idAmostra'
      )
      .innerJoin('exame', 'exame.idExame', 'amostra_contem_exames_aux.idExame')
      .where('tipo_analise', tipo_analise)
      .then((data) => {
        try {
          const amostraAtual = data;
          for (let i = 0; i < amostraAtual.length; i += 1) {
            amostraAtual[i].f_dt_coleta = viewDateFormat(
              amostraAtual[i].dt_coleta
            );
          }
          res.json(amostraAtual);
        } catch (error) {
          res.json(objError);
        }
      })
      .catch(() => {
        res.json(objError);
      })
      .catch(() => {
        res.json(objError);
      });
  });

  app.get('/buscar', loggedIn, (req, res) => {
    const query = req.query.query ? req.query.query : '';
    database('paciente')
      .select()
      .then((pacientes) => {
        database('solicitante')
          .select()
          .then((solicitantes) => {
            database('exame')
              .select()
              .then((exames) => {
                database('amostra')
                  .select()
                  .then((amostras) => {
                    try {
                      const novosPacientes = pacientes.filter(
                        (paciente) =>
                          paciente.idPaciente === parseInt(query, 10) ||
                          paciente.nome.includes(query) ||
                          (paciente.etnia
                            ? paciente.etnia.includes(query)
                            : false) ||
                          (paciente.naturalidade_cidade
                            ? paciente.naturalidade_cidade.includes(query)
                            : false) ||
                          (paciente.naturalidade_estado
                            ? paciente.naturalidade_estado.includes(query)
                            : false) ||
                          (paciente.observacao
                            ? paciente.observacao.includes(query)
                            : false) ||
                          (paciente.cadastrado_por
                            ? paciente.cadastrado_por.includes(query)
                            : false)
                      );

                      const novosSolicitantes = solicitantes.filter(
                        (solicitante) =>
                          solicitante.idSolicitante === parseInt(query, 10) ||
                          solicitante.nome.includes(query) ||
                          (solicitante.estado
                            ? solicitante.estado.includes(query)
                            : false) ||
                          (solicitante.cidade
                            ? solicitante.cidade.includes(query)
                            : false) ||
                          (solicitante.endereco
                            ? solicitante.endereco.includes(query)
                            : false) ||
                          (solicitante.e_mail
                            ? solicitante.e_mail.includes(query)
                            : false) ||
                          (solicitante.contato_referencia
                            ? solicitante.contato_referencia.includes(query)
                            : false) ||
                          (solicitante.observacao
                            ? solicitante.observacao.includes(query)
                            : false) ||
                          (solicitante.cadastrado_por
                            ? solicitante.cadastrado_por.includes(query)
                            : false)
                      );

                      const novosExames = exames.filter(
                        (exame) =>
                          exame.idExame === parseInt(query, 10) ||
                          exame.nome.includes(query) ||
                          (exame.sigla
                            ? exame.sigla === parseInt(query, 10)
                            : false) ||
                          (exame.tipo_analise
                            ? exame.tipo_analise.includes(query)
                            : false) ||
                          (exame.metodo
                            ? exame.metodo.includes(query)
                            : false) ||
                          (exame.preco ? exame.preco.includes(query) : false) ||
                          (exame.valor_ref
                            ? exame.valor_ref.includes(query)
                            : false) ||
                          (exame.tipo_valor_ref
                            ? exame.tipo_valor_ref.includes(query)
                            : false) ||
                          (exame.observacao
                            ? exame.observacao.includes(query)
                            : false) ||
                          (exame.cadastrado_por
                            ? exame.cadastrado_por.includes(query)
                            : false)
                      );

                      const novasAmostras = amostras.filter(
                        (amostra) =>
                          amostra.idAmostra === parseInt(query, 10) ||
                          (amostra.cod ? amostra.cod.includes(query) : false) ||
                          amostra.idPaciente === parseInt(query, 10) ||
                          amostra.idSolicitante === parseInt(query, 10) ||
                          (amostra.material
                            ? amostra.material.includes(query)
                            : false) ||
                          (amostra.codigo_barra
                            ? amostra.codigo_barra.includes(query)
                            : false) ||
                          (amostra.suspeita_diagnostico
                            ? amostra.suspeita_diagnostico.includes(query)
                            : false) ||
                          (amostra.medicamentos
                            ? amostra.medicamentos.includes(query)
                            : false) ||
                          (amostra.interpretacao_resultados
                            ? amostra.interpretacao_resultados.includes(query)
                            : false) ||
                          (amostra.status_pedido
                            ? amostra.status_pedido.includes(query)
                            : false) ||
                          (amostra.contato_referencia
                            ? amostra.contato_referencia.includes(query)
                            : false) ||
                          (amostra.observacao
                            ? amostra.observacao.includes(query)
                            : false) ||
                          (amostra.cadastrado_por
                            ? amostra.cadastrado_por.includes(query)
                            : false)
                      );

                      for (let i = 0; i < novosPacientes.length; i += 1) {
                        novosPacientes[i].recem_nascido = novosPacientes[i]
                          .recem_nascido
                          ? 'Sim'
                          : 'Não';
                        novosPacientes[i].dt_nasc = viewDateFormat(
                          novosPacientes[i].dt_nasc
                        );
                        novosPacientes[i].cadastrado_em = viewDateFormat(
                          novosPacientes[i].cadastrado_em
                        );
                      }

                      for (let i = 0; i < novosSolicitantes.length; i += 1) {
                        novosSolicitantes[i].cadastrado_em = viewDateFormat(
                          novosSolicitantes[i].cadastrado_em
                        );
                      }

                      for (let i = 0; i < novosExames.length; i += 1) {
                        novosExames[i].cadastrado_em = viewDateFormat(
                          novosExames[i].cadastrado_em
                        );
                      }

                      for (let i = 0; i < novasAmostras.length; i += 1) {
                        novasAmostras[i].cadastrado_em = viewDateFormat(
                          novasAmostras[i].cadastrado_em
                        );
                        novasAmostras[i].dt_solicitacao = viewDateFormat(
                          novasAmostras[i].dt_solicitacao
                        );
                        novasAmostras[i].dt_recebimento = viewDateFormat(
                          novasAmostras[i].dt_recebimento
                        );
                        novasAmostras[i].dt_coleta = viewDateFormat(
                          novasAmostras[i].dt_coleta
                        );
                        novasAmostras[i].dt_liberacao = viewDateFormat(
                          novasAmostras[i].dt_liberacao
                        );
                        novasAmostras[i].transfusao = novasAmostras[i]
                          .transfusao
                          ? 'Sim'
                          : 'Não';
                        novasAmostras[i].gestante = novasAmostras[i].gestante
                          ? 'Sim'
                          : 'Não';
                        novasAmostras[i].uso_medicamentos = novasAmostras[i]
                          .uso_medicamentos
                          ? 'Sim'
                          : 'Não';
                      }
                      res.render('relatorios/buscar', {
                        pacientes: novosPacientes,
                        solicitantes: novosSolicitantes,
                        exames: novosExames,
                        amostras: novasAmostras
                      });
                    } catch (error) {
                      res.render('layouts/fatal_error', {
                        error
                      });
                    }
                  })
                  .catch((error) => {
                    res.render('layouts/fatal_error', {
                      error
                    });
                  });
              })
              .catch((error) => {
                res.render('layouts/fatal_error', {
                  error
                });
              });
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
