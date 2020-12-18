const database = require("../../../config/database/connection")
const solicitanteDAO = require('../../dao/solicitanteDAO')
DAOSolicitante = new solicitanteDAO(database)

//Bibliotecas internas
const utilsDate = require('../../../utils/date')
const { loggedIn } = require("../../helpers/login")

module.exports = (app) => {
    app.get('/solicitantes', loggedIn, (req, res) => {
        res.render('solicitantes/')
    })

    app.get('/editar-solicitante/:id', loggedIn, (req, res) => {
        DAOSolicitante.getSolicitante(req.params.id).then((data) => {
            data[0].cadastrado_em = utilsDate.inputDateFormat(data[0].cadastrado_em)
            res.render('solicitantes/editar', { data: data[0] })
        })
    })

    app.get('/solicitantes/:id', loggedIn, (req, res) => {
        DAOSolicitante.getSolicitante(req.params.id).then((data) => {
            data[0].cadastrado_em = utilsDate.viewDateFormat(data[0].cadastrado_em)
            res.render('solicitantes/visualizar', { data: data[0] })
        })
    })

    app.get('/cadastrar-solicitante', loggedIn, (req, res) => {
        res.render('solicitantes/cadastrar')
    })
}