const resultExameController = require('../controller/resultExameController')

class resultExameDAO {

    obj_error = { status: 'error' }
    obj_success = { status: 'sucess' }

    constructor(database) {
        this.database = database
    }

    //Lista todos os resultados de exame
    async getResultExames() {
        try {
            return await this.database('resultados_exame').select()
        } catch (error) {
            throw this.obj_error
        }
    }

    //Lista um resultado de exame a patir de sua chave primária
    async getResultExame(id) {
        try {
            return await this.database('resultados_exame').where('idresultado', id).select()
        } catch (error) {
            throw this.obj_error
        }
    }


    //Adiciona um novo resultado de exame ao BD
    async addResultExame(data) {
        try {
            await this.database('resultados_exame').insert({
                resultado_possivel: data.resultado_possivel,
                idade_maior_6m: data.idade_maior_6m
            })
            return this.obj_success
        } catch (error) {
            throw this.obj_error
        }
    }

    //Atualiza um resultado de exame no BD
    async updateResultExame(data) {
        const id = data.idResultado

        try {
            await this.database('resultados_exame').where('idresultado', id).update({
                resultado_possivel: data.resultado_possivel,
                idade_maior_6m: data.idade_maior_6m
            })
            return this.obj_success
        } catch (error) {
            throw this.obj_error
        }
    }

    //Remove um resultado de exame do BD
    async removeResultExame(id) {
        try {
            await this.database('resultados_exame').where('idresultado', id).del()
            return this.obj_success
        } catch (error) {
            throw this.obj_error
        }
    }
}

module.exports = resultExameDAO