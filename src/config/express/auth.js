const passport = require("passport")
const database = require('../../config/database/connection')
const localStrategy = require("passport-local").Strategy

//------------------------------------------------------------

module.exports = (passport) => {
    passport.use(new localStrategy({
        usernameField: 'login',
        passwordField: 'senha'
    }, (login, senha, done) => {
        //Procura o usuário com nome e senha
        database.select().from('usuario').where({
            login: login,
            senha: senha
        }).then((data) => {
            //Usuário não existe 
            if (data[0] == undefined) {
                return done(null, false, { message: 'Usuário ou senha inválidos.' })
            } else {
                return done(null, data[0])
            }
        })
    }))
}

//------------------------------------------------------------

//Serialização
passport.serializeUser((user, done) => {
    console.log(`\n${new Date().getHours()}:${new Date().getMinutes()} - Login: ${user.nome}\n`)
    done(null, user.login)
})

//Deserialização
passport.deserializeUser((login, done) => {
    database('usuario').where({
        login: login
    }).then(([user]) => {
        if (user) {
            role = null
            done(null, user)
        }
    })
})