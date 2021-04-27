const database = require("../../../config/database/connection")
const exameDAO = require('../../dao/exameDAO')
DAOExame = new exameDAO(database)

//Bibliotecas internas
const utilsDate = require('../../../utils/date')
const { loggedIn } = require("../../helpers/login")

module.exports = (app) => {
    app.get('/exames', loggedIn, (req, res) => {
        res.render('exames/')
    })

    app.get('/editar-exame/:id', loggedIn, (req, res) => {
        DAOExame.getExame(req.params.id).then((data) => {
            data[0].cadastrado_em = utilsDate.inputDateFormat(data[0].cadastrado_em)

            intervalo = null
            if (data[0].tabela_intervalo != null && data[0].tabela_intervalo != '') {
                intervalo = JSON.parse(data[0].tabela_intervalo)
            }
            res.render('exames/editar', { data: data[0], intervalo: intervalo })
        })
    })

    app.get('/exames/:id', loggedIn, (req, res) => {
        DAOExame.getExame(req.params.id).then((data) => {
            data[0].cadastrado_em = utilsDate.viewDateFormat(data[0].cadastrado_em)

            intervalo = null
            if (data[0].tabela_intervalo != null && data[0].tabela_intervalo != '') {
                intervalo = JSON.parse(data[0].tabela_intervalo)
            }

            res.render('exames/visualizar', { data: data[0], intervalo: intervalo })
        })
    })

    app.get('/cadastrar-exame', loggedIn, (req, res) => {
        res.render('exames/cadastrar')
    })
}