const database = require('./connection')
const fs = require('fs')

module.exports = async() => {
    //Importa o arquivo biomol.sql
    const sql = fs.readFileSync('src/config/database/sql/createTable.sql').toString()

    //Executa o script de criação de tabelas.
    result = null
   // let result = await database.raw(sql)

    return result
}