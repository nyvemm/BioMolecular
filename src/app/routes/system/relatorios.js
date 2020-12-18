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
            })
    })

    app.get('/relatorios/laudo', loggedIn, (req, res) => {
        res.render('relatorios/laudo')
    })

    app.get('/relatorios/gerar-laudo', (req, res) => {
        const id = req.query.id
        database.select(database.raw(`getInfoExamesLaudo(${id})`))
            .then(data => res.json(data))
            .catch(error => {
                res.json({ status: 'error' })
            })
    })
}