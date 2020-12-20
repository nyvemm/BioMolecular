const database = require("../../../config/database/connection")

//Bibliotecas internas
const utilsDate = require('../../../utils/date')
const { loggedIn } = require("../../helpers/login")

module.exports = (app) => {
    app.get('/relatorios', loggedIn, (req, res) => {
        database('amostra').select(database.raw(`*, paciente.nome as paciente_nome, solicitante.nome as solicitante_nome`))
            .innerJoin('paciente', 'amostra.idpaciente', 'paciente.idpaciente')
            .innerJoin('solicitante', 'amostra.idsolicitante', 'solicitante.idsolicitante')
            .orderBy('dt_recebimento', 'desc').then(amostra => {
                amostra.forEach(amostra => {
                    amostra.f_dt_recebimento = utilsDate.viewDateFormat(amostra.dt_recebimento)
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
            console.log(materiais.map(x => x.material))
            res.render('relatorios/relatorio-material', { materiais: materiais.map(x => x.material) })
        })
    })

    app.get('/relatorios/amostras-tipo-exame', loggedIn, (req, res) => {
        database('amostra').innerJoin('amostra_contem_exames_aux', 'amostra_contem_exames_aux.idamostra', 'amostra.idamostra')
            .innerJoin('exame', 'exame.idexame', 'amostra_contem_exames_aux.idexame')
            .select('tipo_analise').distinct().then(tipo_analises => {
                console.log(tipo_analises.map(x => x.tipo_analise))
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
        database('amostra').distinct().select(database.raw(`material, dt_coleta, paciente.nome as paciente_nome, solicitante.nome as solicitante_nome`))
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

}