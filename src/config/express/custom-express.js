const express = require('express')
const bodyParser = require('body-parser')

const routes = require('src/app/routes/routes')
const app = express()

//Body-parser como middleware para desencapsular as requisições.
app.use(bodyParser.urlencoded({ extended: true }))

//Definição das rotas
routes(app)

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