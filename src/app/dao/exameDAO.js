class exameDAO {

    obj_error = { status: 'error' }
    obj_success = { status: 'success' }

    constructor(database) {
        this.database = database
    }

    //Lista todos os exames
    async getExames(data) {
        try {
            let offset = data.offset ? data.offset : 0
            let sort = data.sort ? data.sort : 'idexame'
            return await this.database('exame').select().offset(offset).orderBy(sort)
        } catch (error) {
            throw this.obj_error
        }
    }

    //Lista exame por seu id (chave primária)
    async getExame(id) {
        try {
            return await this.database('exame').where('idexame', id).select()
        } catch (error) {
            throw this.obj_error
        }
    }

    //Adiciona um novo exame ao BD
    async addExame(data) {

        try {
            await this.database('exame').insert({
                nome: data.nome,
                sigla: data.sigla,
                tipo_analise: data.tipo_analise,
                metodo: data.metodo,
                valor_ref: data.valor_ref,
                tipo_valor_ref: data.tipo_valor_ref,
                preco: data.preco,
                tipo_resultado: data.tipo_resultado,
                valor_ref: data.valor_ref,
                tipo_valor_ref: data.tipo_valor_ref,
                cadastrado_por: data.cadastrado_por
            })
            return this.obj_success
        } catch (error) {
            throw this.obj_error
        }
    }

    //Atualiza os dados de um exame no BD
    async updateExame(data) {
        const id = data.idexame
        try {
            await this.database('exame').where('idexame', id).update({
                nome: data.nome,
                sigla: data.sigla,
                tipo_analise: data.tipo_analise,
                metodo: data.metodo,
                preco: data.preco,
                valor_ref: data.valor_ref,
                tipo_resultado: data.tipo_resultado,
                tipo_valor_ref: data.tipo_valor_ref
            })
            return this.obj_success
        } catch (error) {
            return this.obj_error
        }
    }

    //Remove um exame do BD
    async deleteExame(id) {
        try {
            await this.database('exame').where('idexame', id).del()
            return this.obj_success
        } catch (error) {
            throw this.obj_error
        }
    }

}

module.exports = exameDAO