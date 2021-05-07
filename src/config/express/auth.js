import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

// eslint-disable-next-line import/extensions
import database from '../database/connection.js';
//------------------------------------------------------------

export default (currentPassport) => {
  currentPassport.use(new LocalStrategy({
    usernameField: 'login',
    passwordField: 'senha',
  }, (login, senha, done) => {
    // Procura o usuário com nome e senha
    database.select().from('usuario').where({
      login,
      senha,
    }).then((data) => {
      // Usuário não existe
      if (data[0] === undefined) {
        return done(null, false, { message: 'Usuário ou senha inválidos.' });
      }
      return done(null, data[0]);
    });
  }));
};

//------------------------------------------------------------

// Serialização
passport.serializeUser((user, done) => {
  // console.log(`${new Date().getHours()}:${new Date().getMinutes()} - Login: ${user.nome}`);
  done(null, user.login);
});

// Deserialização
passport.deserializeUser((login, done) => {
  database('usuario').where({
    login,
  }).then(([user]) => {
    if (user) {
      done(null, user);
    }
  });
});
