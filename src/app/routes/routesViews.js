const database = require('../../config/database/connection')

/* Rotas do front-end */
const routesLogin = require('./system/login');
const routesPrincipal = require('./system/principal');
const routesPacientes = require('./system/pacientes');
const routesSolicitantes = require('./system/solicitantes');
const routesExames = require('./system/exames');
const routesAmostras = require('./system/amostras');
const routesUsuarios = require('./system/usuarios');
const routesRelatorios = require('./system/relatorios');

module.exports =  (app) => {
  /* Rotas do front-end */
  routesLogin(app, database);
  routesPrincipal(app, database);
  routesPacientes(app, database);
  routesSolicitantes(app, database);
  routesExames(app, database);
  routesAmostras(app, database);
  routesUsuarios(app, database);
  routesRelatorios(app, database);
};
