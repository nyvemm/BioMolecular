const database = require("../../../config/database/connection")
const usuarioDAO = require('../../dao/usuarioDAO')
DAOUsuario = new usuarioDAO(database)

const { loggedIn } = require("../../helpers/login")
const usuario = require("../database/usuario")

module.exports = (app) => {
    app.get('/meu-perfil', loggedIn, (req, res) => {
        req.user.foto = req.user.foto ? req.user.foto : '/img/sem-foto.png'
        res.render('usuarios/meu-perfil', { usuario: req.user })
    })

    app.get('/administrador', loggedIn, (req, res) => {
        DAOUsuario.getUsuarios().then((usuarios) => {
            usuarios.forEach((usuario) => {
                usuario.foto = usuario.foto ? usuario.foto : '/img/sem-foto.png'
            })

            res.render('usuarios/administrador', { data: usuarios })
        })
    })

    app.get('/administrador/cadastrar-usuario', loggedIn, (req, res) => {
        res.render('usuarios/cadastrar')
    })
}