const database = require("../../../config/database/connection")
const pacienteDAO = require('../../dao/pacienteDAO')
DAOPaciente = new pacienteDAO(database)

//Bibliotecas internas
const utilsDate = require('../../../utils/date')
const { loggedIn } = require("../../helpers/login")

module.exports = (app) => {
    app.get('/pacientes', loggedIn, (req, res) => {
        res.render('pacientes/')
    })

    app.get('/pacientes/:id', loggedIn, (req, res) => {
        DAOPaciente.getPaciente(req.params.id).then((data) => {
            data[0].dt_nasc = utilsDate.inputDateFormat(data[0].dt_nasc)
            data[0].cadastrado_em = utilsDate.inputDateFormat(data[0].cadastrado_em)
            res.render('pacientes/editar', { data: data[0] })
        })
    })

    app.get('/cadastrar-paciente', loggedIn, (req, res) => {
        res.render('pacientes/cadastrar')
    })
}