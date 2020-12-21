const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const handlebars = require('express-handlebars')

//Bibliotecas internas
const utilsDate = require('../../utils/date')

//Tratamento de exceção
const flash = require("connect-flash")

//Autenticação
const passport = require('passport')
require('./auth')(passport)

//Sessão
const session = require("express-session")


//------------------------------------------------------------
const routes = require('../../app/routes/routes')
const routesViews = require('../../app/routes/routesViews')
const multer = require('./file-upload')

const app = express()

//Configuração da Sessão
app.use(session({
    secret: "biomol",
    resave: true,
    saveUnitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

//Configuração do Flash-express
app.use(flash())

//Define a engine como sendo os handlebars com arquivos .hbs.
const hbs = handlebars.create({
    extname: 'hbs',

    helpers: {
        select: function(selected, options) {
            return options.fn(this).replace(
                new RegExp(' value=\"' + selected + '\"'),
                '$& selected="selected"');
        }
    }
})

app.engine('hbs', handlebars(hbs))
app.set('views', path.join(__dirname, '/../../views'))
app.set('view engine', 'hbs');

// Arquivos estáticos
app.use(express.static(path.join(__dirname, '/../../public')))

//Privilégios de Acesso
const { loggedIn } = require("../../app/helpers/login")
const { resolveCname } = require('dns')
const dateUtils = require('../../utils/date')

//------------------------------------------------------------

//Middlewares
app.use((req, res, next) => {
    // Mensagem de erro e sucesso
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.message = req.flash("message")
        // Verifica se o usuário está logado 
    res.locals.user = req.user || null
        // Verifica os privilégios do usuário
    res.locals.admin = role
    next()
})

//Body-parser como middleware para desencapsular as requisições.
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

var role = null

//Definição das rotas do back-end.
routes(app)
routesViews(app)

//Caso a página requisitada não exista, retorna uma mensagem.
app.use((req, res, next) => {
    res.status(404).end('Página não encontrada.')
})

//Caso ocorra um erro interno no servidor, retorna uma mensagem.
app.use(function(error, req, resp, next) {
    resp.status(500).end('Houve um erro interno no servidor.')
    console.log(error)
})

module.exports = app