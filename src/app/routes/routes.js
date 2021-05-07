/* eslint-disable import/extensions */
import database from '../../config/database/connection.js';

/* Rotas do back-end */
import routesUsuario from './database/usuario.js';
import routesPaciente from './database/paciente.js';
import routesSolicitante from './database/solicitante.js';
import routesExame from './database/exame.js';
import routesAmostra from './database/amostra.js';

// // Criação do banco de dados
// dummy()
//   .then((data) => { console.log('SERVER: [Banco de Dados Criado com Sucesso]'); })
//   .catch((error) => {
//     console.log('SERVER: [Falha em criar Banco de Dados]');
//     console.log(error);
//   });

export default (app) => {
  /* Rotas do back-end */
  routesUsuario(app, database);
  routesPaciente(app, database);
  routesSolicitante(app, database);
  routesExame(app, database);
  routesAmostra(app, database);
};
