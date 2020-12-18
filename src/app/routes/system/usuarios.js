const database = require("../../../config/database/connection")
const { loggedIn } = require("../../helpers/login")

module.exports = (app) => {
    app.get('/meu-perfil', loggedIn, (req, res) => {
        req.user.foto = req.user.foto ? req.user.foto : '/img/sem-foto.png' 
        console.log(req.user)
        res.render('usuarios/meu-perfil', {usuario: req.user})
    })
}