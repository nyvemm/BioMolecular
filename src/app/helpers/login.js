function loggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    if (!req.user.solicitante) {
      next();
    } else {
      res.redirect('/login');
    }
  } else {
    res.redirect('/login');
  }
}

function visitanteLogin(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.solicitante) {
      next();
    } else {
      res.redirect('/login');
    }
  } else {
    res.redirect('/login');
  }
}

module.exports = { loggedIn, visitanteLogin };
