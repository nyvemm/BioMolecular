import { readFileSync } from 'fs';
// eslint-disable-next-line import/extensions
import database from './connection.js';

export default async () => {
  // Importa o arquivo biomol.sql
  const sql = readFileSync('src/config/database/sql/createTable.sql').toString();

  // Executa o script de criação de tabelas.
  const result = await database.raw(sql);

  return result;
};
