const passport = require('passport');

module.exports =  (app) => {
  app.get('/login', (req, res) => {
    res.render('login/');
  });

  app.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Deslogado com sucesso.');
    res.redirect('/login');
  });

  app.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true,
      badRequestMessage: 'Credenciais inválidas.',
    })(req, res, next);
  });
};
