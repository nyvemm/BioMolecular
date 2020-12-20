const database = require("../../../config/database/connection")
const amostraDAO = require('../../dao/amostraDAO')
DAOAmostra = new amostraDAO(database)

//Bibliotecas internas
const utilsDate = require('../../../utils/date')
const { loggedIn } = require("../../helpers/login")
const exames = require("./exames")

module.exports = (app) => {

    /* Resultados */
    app.get('/resultados/:id', (req, res) => {
        database('resultados').select().where('amostra_contem_exames_aux.idamostra', req.params.id)
            .innerJoin('amostra_contem_exames_aux', 'amostra_contem_exames_aux.idamostraexame', 'resultados.idamostraexame').then((data) => {
                res.json(data)
            })
    })


    app.delete('/resultados/:id', (req, res) => {
        const id = req.params.id
        database('resultados').where('idresultado', id).del().then((data) => {
            res.json({ status: 'success' })
        }).catch((err) => {
            res.json({ status: 'error' })
        })
    })

    app.get('/submeter-resultado/:id', (req, res) => {
        const id = req.params.id
        database('amostra_contem_exames_aux').where('idamostraexame', id).update({
            status: true,
            liberado_em: new Date()
        }).then(() => {
            /* Pega o ID da Amostra */
            database('amostra_contem_exames_aux').where('idamostraexame', id)
                .select('idamostra').then(idamostra => {

                    /* Pega a lista de todos os exames */
                    database('amostra_contem_exames_aux').where('idamostra', idamostra[0].idamostra)
                        .select().then(amostras => {

                            /* Pega a lista de amostras finalizadas */
                            let finalizadas = amostras.filter(am_ex => am_ex.status)
                            let final_status = ''

                            if (finalizadas.length == amostras.length) {
                                final_status = 'Finalizado'
                            } else if (finalizadas.length >= 1) {
                                final_status = 'Parcialmente avaliado'
                            } else {
                                final_status = 'Não avaliado'
                            }

                            /* Seta o resultado na amostra */
                            database('amostra').update({ status_pedido: final_status, dt_liberacao: new Date() })
                                .where('idamostra', idamostra[0].idamostra)
                                .then(() => {
                                    res.json({ status: 'success' })
                                })
                        })
                })
        }).catch((err) => {
            res.json({ status: 'error' })
        })
    })

    app.post('/resultados/', (req, res) => {
        const data = req.body
        database('resultados').insert({
            idamostraexame: data.idamostraexame,
            valor_resultado: data.valor_resultado,
            observacao_resultado: data.observacao_resultado
        }).then(() => {
            res.json({ status: 'success' })
        }).catch((err) => {
            res.json({ status: 'error' })
        })
    })

    app.get('/amostras', loggedIn, (req, res) => {
        res.render('amostras/')
    })

    app.get('/amostras/:id', loggedIn, (req, res) => {
        DAOAmostra.getAmostra(req.params.id).then((data) => {
            data[0].cadastrado_em = utilsDate.viewDateFormat(data[0].cadastrado_em)
            data[0].f_dt_recebimento = utilsDate.viewDateFormat(data[0].dt_recebimento)
            data[0].f_dt_solicitacao = utilsDate.viewDateFormat(data[0].dt_solicitacao)
            data[0].f_dt_coleta = utilsDate.viewDateFormat(data[0].dt_coleta)
            data[0].f_dt_ult_transfusao = utilsDate.viewDateFormat(data[0].dt_ult_transfusao)

            data[0].finalizado = data[0].status_pedido == 'Finalizado'

            /* Idade do Paciente */
            if (data[0].dt_coleta) {
                const diffTime = Math.abs(data[0].dt_coleta - data[0].dt_nasc);
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                data[0].idade_coleta = Math.floor(diffDays / 365)
                data[0].idade_coleta_meses = Math.floor((diffDays % 365) / 30)
            }

            database('amostra_contem_exames_aux').select().where('idamostra', req.params.id)
                .innerJoin('exame', 'amostra_contem_exames_aux.idexame', 'exame.idexame').then(exame => {
                    let cont = 0;
                    exame.forEach((currentExame) => {
                        if (currentExame.status) cont++
                    })

                    exame.total_exames = exame.length
                    exame.exames_realizados = cont
                    res.render('amostras/visualizar', { data: data[0], exame: exame })
                })
        })
    })

    app.get('/editar-amostra/:id', loggedIn, (req, res) => {
        DAOAmostra.getAmostra(req.params.id).then((data) => {
            data[0].cadastrado_em = utilsDate.inputDateFormat(data[0].cadastrado_em)
            data[0].dt_recebimento = utilsDate.inputDateFormat(data[0].dt_recebimento)
            data[0].dt_solicitacao = utilsDate.inputDateFormat(data[0].dt_solicitacao)
            data[0].dt_coleta = utilsDate.inputDateFormat(data[0].dt_coleta)
            data[0].dt_ult_transfusao = utilsDate.inputDateFormat(data[0].dt_ult_transfusao)

            database('amostra_contem_exames_aux').select().where('idamostra', req.params.id)
                .innerJoin('exame', 'amostra_contem_exames_aux.idexame', 'exame.idexame').then(exame => {
                    let cont = 0;
                    exame.forEach((currentExame) => {
                        if (currentExame.status) cont++
                    })
                    exame.total_exames = exame.length
                    exame.exames_realizados = cont
                    res.render('amostras/editar', { data: data[0], exame: exame })
                })
        })
    })

    app.get('/cadastrar-resultado/:id', loggedIn, (req, res) => {
        database('amostra_contem_exames_aux').select().where('amostra.idamostra', req.params.id)
            .innerJoin('exame', 'amostra_contem_exames_aux.idexame', 'exame.idexame')
            .innerJoin('amostra', 'amostra.idamostra', 'amostra_contem_exames_aux.idamostra').then(exames => {
                let cont = 0;
                let data = {}

                exames.forEach((currentExame) => { if (currentExame.status) cont++ })

                data.total_exames = exames.length
                data.exames_realizados = cont
                data.idamostra = req.params.id
                data.status_pedido = exames[0].status_pedido

                database('amostra_contem_exames_aux').select('tipo_analise').distinct().where('idamostra', req.params.id)
                    .innerJoin('exame', 'amostra_contem_exames_aux.idexame', 'exame.idexame').then((tipos_exame) => {
                        data.exames = []

                        let lista_exames = tipos_exame.map(t => t.tipo_analise)
                        lista_exames.forEach((tipo_exame) => {
                            data.exames.push({ tipo: tipo_exame, valor: [] })
                        })

                        exames.forEach((exame) => {
                            exame.liberado_em = utilsDate.viewDateFormat(exame.liberado_em)
                            let tipo = exame.tipo_analise
                            data.exames[lista_exames.findIndex((elem) => elem == tipo)].valor.push(exame)
                        })

                        res.render('amostras/resultados', { data: data, amostra: exames[0] })
                    })

            })
    })

    app.get('/cadastrar-amostra', loggedIn, (req, res) => {
        res.render('amostras/cadastrar')
    })
}