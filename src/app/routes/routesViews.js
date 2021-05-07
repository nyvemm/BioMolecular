/* eslint-disable import/extensions */
import database from '../../config/database/connection.js';

/* Rotas do front-end */
import routesLogin from './system/login.js';
import routesPrincipal from './system/principal.js';
import routesPacientes from './system/pacientes.js';
import routesSolicitantes from './system/solicitantes.js';
import routesExames from './system/exames.js';
import routesAmostras from './system/amostras.js';
import routesUsuarios from './system/usuarios.js';
import routesRelatorios from './system/relatorios.js';

export default (app) => {
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
