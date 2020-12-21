const database = require("../../../config/database/connection")

//Bibliotecas internas
const utilsDate = require('../../../utils/date')
const { loggedIn } = require("../../helpers/login")

module.exports = (app) => {
    app.get('/relatorios', loggedIn, (req, res) => {
        database('amostra').select(database.raw(`*, paciente.nome as paciente_nome, solicitante.nome as solicitante_nome`))
            .innerJoin('paciente', 'amostra.idpaciente', 'paciente.idpaciente')
            .innerJoin('solicitante', 'amostra.idsolicitante', 'solicitante.idsolicitante')
            .orderBy('dt_coleta', 'desc').then(amostra => {
                amostra.forEach(amostra => {
                    amostra.f_dt_recebimento = utilsDate.viewDateFormat(amostra.dt_recebimento)
                    amostra.f_dt_coleta = utilsDate.viewDateFormat(amostra.dt_coleta)
                    amostra.f_dt_solicitacao = utilsDate.viewDateFormat(amostra.dt_solicitacao)
                    amostra.finalizado = amostra.status_pedido == 'Finalizado'
                    amostra.em_analise = amostra.status_pedido == 'Parcialmente avaliado'
                    amostra.cadastrado = amostra.status_pedido == 'Não avaliado'
                })

                res.render('relatorios', { amostra: amostra })
            }).catch(error => {
                console.log(error)
                res.redirect('/')
            })
    })

    app.get('/relatorios/laudo', loggedIn, (req, res) => {
        res.render('relatorios/laudo')
    })

    app.get('/relatorios/amostras-situacao', loggedIn, (req, res) => {
        database('amostra').select('status_pedido').distinct().then(situacoes => {
            res.render('relatorios/relatorio-situacao', { situacoes: situacoes.map(x => x.status_pedido) })
        })
    })

    app.get('/relatorios/amostras-material', loggedIn, (req, res) => {
        database('amostra').select('material').distinct().then(materiais => {
            res.render('relatorios/relatorio-material', { materiais: materiais.map(x => x.material) })
        })
    })

    app.get('/relatorios/amostras-tipo-exame', loggedIn, (req, res) => {
        database('amostra').innerJoin('amostra_contem_exames_aux', 'amostra_contem_exames_aux.idamostra', 'amostra.idamostra')
            .innerJoin('exame', 'exame.idexame', 'amostra_contem_exames_aux.idexame')
            .select('tipo_analise').distinct().then(tipo_analises => {
                res.render('relatorios/relatorio-tipo-exame', { tipo_analises: tipo_analises.map(x => x.tipo_analise) })
            })

    })

    /* CRUD */
    app.get('/relatorios/gerar-laudo', loggedIn, (req, res) => {
        const id = req.query.id
        database('amostra_contem_exames_aux').where('amostra_contem_exames_aux.idamostra', id)
            .innerJoin('amostra', 'amostra.idamostra', 'amostra_contem_exames_aux.idamostra')
            .innerJoin('exame', 'exame.idexame', 'amostra_contem_exames_aux.idexame')
            .leftJoin('resultados', 'resultados.idamostraexame', 'amostra_contem_exames_aux.idamostraexame')
            .then(data => {

                database('amostra_contem_exames_aux').select('tipo_analise').distinct().where('idamostra', id)
                    .innerJoin('exame', 'amostra_contem_exames_aux.idexame', 'exame.idexame').then((tipos_exame) => {
                        let resultados_exames = []

                        let lista_exames = tipos_exame.map(t => t.tipo_analise)
                        lista_exames.forEach((tipo_exame) => {
                            resultados_exames.push({ tipo: tipo_exame, valor: [] })
                        })


                        data.forEach((exame) => {
                            exame.liberado_em = utilsDate.viewDateFormat(exame.liberado_em)
                            let tipo = exame.tipo_analise
                            resultados_exames[lista_exames.findIndex((elem) => elem == tipo)].valor.push(exame)
                        })

                        res.json(resultados_exames)
                    })
            })
            .catch(error => {
                console.log(error)
                res.json({ status: 'error' })
            })
    })

    /* CRUD */
    app.get('/relatorios/gerar-amostras-situacao', (req, res) => {
        const situacao = req.query.situacao
        database('amostra').select(database.raw(`*, paciente.nome as paciente_nome, solicitante.nome as solicitante_nome`))
            .innerJoin('paciente', 'amostra.idpaciente', 'paciente.idpaciente')
            .innerJoin('solicitante', 'amostra.idsolicitante', 'solicitante.idsolicitante')
            .where('status_pedido', situacao)
            .then(data => {
                data.map(x => x.f_dt_coleta = utilsDate.viewDateFormat(x.dt_coleta))
                res.json(data)
            }).catch(error => {
                console.log(error)
                res.json({ status: 'error' })
            })
    })

    /* CRUD */
    app.get('/relatorios/gerar-amostras-material', (req, res) => {
        const material = req.query.material
        database('amostra').select(database.raw(`*, paciente.nome as paciente_nome, solicitante.nome as solicitante_nome`))
            .innerJoin('paciente', 'amostra.idpaciente', 'paciente.idpaciente')
            .innerJoin('solicitante', 'amostra.idsolicitante', 'solicitante.idsolicitante')
            .where('material', material)
            .then(data => {
                data.map(x => x.f_dt_coleta = utilsDate.viewDateFormat(x.dt_coleta))
                res.json(data)
            }).catch(error => {
                console.log(error)
                res.json({ status: 'error' })
            })
    })

    /* CRUD */
    app.get('/relatorios/gerar-amostras-tipo-exame', (req, res) => {
        const tipo_analise = req.query.tipo_analise
        database('amostra').distinct().select(database.raw(`amostra.idamostra, material, dt_coleta, paciente.nome as paciente_nome, solicitante.nome as solicitante_nome`))
            .innerJoin('paciente', 'amostra.idpaciente', 'paciente.idpaciente')
            .innerJoin('solicitante', 'amostra.idsolicitante', 'solicitante.idsolicitante')
            .innerJoin('amostra_contem_exames_aux', 'amostra_contem_exames_aux.idamostra', 'amostra.idamostra')
            .innerJoin('exame', 'exame.idexame', 'amostra_contem_exames_aux.idexame')
            .where('tipo_analise', tipo_analise)
            .then(data => {
                data.map(x => x.f_dt_coleta = utilsDate.viewDateFormat(x.dt_coleta))
                res.json(data)
            }).catch(error => {
                console.log(error)
                res.json({ status: 'error' })
            })
    })

    app.get('/buscar', (req, res) => {
        let query = req.query.query ? req.query.query : ''
        database('paciente').select().then(pacientes => {
            database('solicitante').select().then(solicitantes => {
                database('exame').select().then(exames => {
                    database('amostra').select().then(amostras => {

                        // console.log(pacientes)
                        // console.log(solicitantes)
                        // console.log(exames)
                        // console.log(amostras)

                        pacientes = pacientes.filter(paciente => {
                            return (paciente.idpaciente == parseInt(query))
                                || (paciente.nome.includes(query))
                                || (paciente.etnia ? paciente.etnia.includes(query) : false)
                                || (paciente.naturalidade_cidade ? paciente.naturalidade_cidade.includes(query) : false)
                                || (paciente.naturalidade_estado ? paciente.naturalidade_estado.includes(query) : false)
                                || (paciente.observacao ? paciente.observacao.includes(query) : false)
                                || (paciente.cadastrado_por ? paciente.cadastrado_por.includes(query) : false)
                        })

                        solicitantes = solicitantes.filter(solicitante => {
                            return solicitante.idsolicitante == parseInt(query)
                                || (solicitante.nome.includes(query))
                                || (solicitante.estado ? solicitante.estado.includes(query) : false)
                                || (solicitante.cidade ? solicitante.cidade.includes(query) : false)
                                || (solicitante.e_mail ? solicitante.e_mail.includes(query) : false)
                                || (solicitante.contato_referencia ? solicitante.contato_referencia.includes(query) : false)
                                || (solicitante.observacao ? solicitante.observacao.includes(query) : false)
                                || (solicitante.cadastrado_por ? solicitante.cadastrado_por.includes(query) : false)
                        })

                        exames = exames.filter(exame => {
                            return exame.idexame == parseInt(query)
                                || (exame.nome.includes(query))
                                || (exame.sigla ? exame.sigla == parseInt(query) : false)
                                || (exame.tipo_analise ? exame.tipo_analise.includes(query) : false)
                                || (exame.metodo ? exame.metodo.includes(query) : false)
                                || (exame.preco ? exame.preco.includes(query) : false)
                                || (exame.valor_ref ? exame.valor_ref.includes(query) : false)
                                || (exame.tipo_valor_ref ? exame.tipo_valor_ref.includes(query) : false)
                                || (exame.tipo_resultado ? exame.tipo_resultado.includes(query) : false)
                                || (exame.observacao ? exame.observacao.includes(query) : false)
                                || (exame.cadastrado_por ? exame.cadastrado_por.includes(query) : false)
                        })

                        amostras = amostras.filter(amostra => {
                            return amostra.idamostra == parseInt(query)
                                || (amostra.idpaciente == parseInt(query))
                                || (amostra.idsolicitante == parseInt(query))
                                || (amostra.material ? amostra.material.includes(query) : false)
                                || (amostra.codigo_barra ? amostra.codigo_barra.includes(query) : false)
                                || (amostra.suspeita_diagnostico ? amostra.suspeita_diagnostico.includes(query) : false)
                                || (amostra.medicamentos ? amostra.medicamentos.includes(query) : false)
                                || (amostra.interpretacao_resultados ? amostra.interpretacao_resultados.includes(query) : false)
                                || (amostra.status_pedido ? amostra.status_pedido.includes(query) : false)
                                || (amostra.contato_referencia ? amostra.contato_referencia.includes(query) : false)
                                || (amostra.observacao ? amostra.observacao.includes(query) : false)
                                || (amostra.cadastrado_por ? amostra.cadastrado_por.includes(query) : false)
                        })

                        pacientes.forEach(paciente => {
                            paciente.recem_nascido = paciente.recem_nascido ? 'Sim' : 'Não'
                            paciente.dt_nasc = utilsDate.viewDateFormat(paciente.dt_nasc)
                            paciente.cadastrado_em = utilsDate.viewDateFormat(paciente.cadastrado_em)
                        })

                        solicitantes.forEach(solicitante => {
                            solicitante.cadastrado_em = utilsDate.viewDateFormat(solicitante.cadastrado_em)
                        })

                        exames.forEach(exame => {
                            exame.cadastrado_em = utilsDate.viewDateFormat(exame.cadastrado_em)
                        })

                        amostras.forEach(amostra => {
                            amostra.cadastrado_em = utilsDate.viewDateFormat(amostra.cadastrado_em)
                            amostra.dt_solicitacao = utilsDate.viewDateFormat(amostra.dt_solicitacao)
                            amostra.dt_recebimento = utilsDate.viewDateFormat(amostra.dt_recebimento)
                            amostra.dt_coleta = utilsDate.viewDateFormat(amostra.dt_coleta)
                            amostra.dt_liberacao = utilsDate.viewDateFormat(amostra.dt_liberacao)
                            amostra.transfusao = amostra.transfusao ? 'Sim' : 'Não'
                            amostra.gestante = amostra.gestante ? 'Sim' : 'Não'
                            amostra.uso_medicamentos = amostra.uso_medicamentos ? 'Sim' : 'Não'
                        })
                        
                        res.render('relatorios/buscar', {
                            pacientes: pacientes,
                            solicitantes: solicitantes,
                            exames: exames,
                            amostras: amostras
                        })
                    })
                })
            })
        })


    })

}