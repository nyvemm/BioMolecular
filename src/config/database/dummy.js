const { readFileSync } = require('fs');
const database = require('./connection');

module.exports =  async () => {
  // Importa o arquivo biomol.sql
  const sql = readFileSync('src/config/database/sql/createTable.sql').toString();

  // Executa o script de criação de tabelas.
  const result = await database.raw(sql);

  return result;
};
