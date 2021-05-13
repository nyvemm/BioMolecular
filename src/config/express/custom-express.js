/* eslint-disable import/extensions */
import express from 'express';
import path from 'path';
import handlebars from 'express-handlebars';

// Bibliotecas internas
import flash from 'connect-flash';
import passport from 'passport';

// Sessão
import session from 'express-session';

// Geração de Hash
import crypto from 'crypto';
import { v1 as uuidv1 } from 'uuid';

//------------------------------------------------------------
import routes from '../../app/routes/routes.js';
import routesViews from '../../app/routes/routesViews.js';

// Autenticação
import auth from './auth.js';

auth(passport);
const app = express();

// Configuração da Sessão
app.use(session({
  secret: 'biomol',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 7200000, // 2 horas
  },
  genid() {
    return crypto.createHash('sha256').update(uuidv1()).update(crypto.randomBytes(256)).digest('hex');
  },
}));

app.use(passport.initialize());
app.use(passport.session());

// Configuração do Flash-express
app.use(flash());

// Define a engine como sendo os handlebars com arquivos .hbs.
const hbs = handlebars.create({
  extname: 'hbs',

  helpers: {
    select(selected, options) {
      return options.fn(this).replace(
        // eslint-disable-next-line no-useless-escape
        new RegExp(`value=\"${selected}\"`),
        '$& selected="selected"',
      );
    },
  },
});

app.engine('hbs', handlebars(hbs));
app.set('views', path.join(process.cwd(), '/src/views'));
app.set('view engine', 'hbs');

// Arquivos estáticos
app.use(express.static(path.join(process.cwd(), '/src/public')));

// Privilégios de Acesso
// const { loggedIn } = require('../../app/helpers/login');
// const dateUtils = require('../../utils/date');

//------------------------------------------------------------

// Middlewares
app.use((req, res, next) => {
  try {
    // Mensagem de erro e sucesso
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.message = req.flash('message');
    // Verifica se o usuário está logado
    res.locals.user = req.user || null;
    // Verifica os privilégios do usuário
    res.locals.admin = req.user ? req.user.administrador : false;
    res.locals.solicitante = req.user ? req.user.solicitante : false;
    next();
  } catch (error) {
    next();
  }
});

// Body-parser como middleware para desencapsular as requisições.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Definição das rotas do back-end.
routes(app);
routesViews(app);

// Caso a página requisitada não exista, retorna uma mensagem.
app.use((req, res) => {
  res.status(404).render('layouts/not_found');
});

// Caso ocorra um erro interno no servidor, retorna uma mensagem.
app.use((error, req, res) => {
  res.status(500).render('layouts/fatal_error', { error });
});

export default app;
