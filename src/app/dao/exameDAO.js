class exameDAO {

    obj_error = { status : 'error' }
    obj_sucess = { status : 'sucess' }

    constructor(database){
        this.database = database
    }

    //Lista todos os exames
    async getExames(){
        try {
            return await this.database('exame').select()
        } catch (error) {
            throw this.obj_error
        }
    }

    //Lista exame por seu id (chave primária)
    async getExame(id){
        try {
            return await this.database('exame').where('idexame', id).select()
        } catch(error) {
            throw this.obj_error
        }
    }

    //Adiciona um novo exame ao BD
    async addExame(data){
        try {
            await this.database('exame').insert({
                nome : data.nome,
                sigla : data.sigla,
                tipo_analise : data.tipo_analise,
                metodo : data.metodo,
                preco : data.preco,
                valor_ref : data.valor_ref,
                tipo_valor_ref : data.tipo_valor_ref
            })
            return this.obj_sucess
        } catch(error) {
            throw this.obj_error
        }
    }

    //Atualiza os dados de um exame no BD
    async updExame(data){
        const id = data.idExame
        try {
            await this.database('exame').where('idexame', id).update({
                nome : data.nome,
                sigla : data.sigla,
                tipo_analise : data.tipo_analise,
                metodo : data.metodo,
                preco : data.preco,
                valor_ref : data.valor_ref,
                tipo_valor_ref : data.tipo_valor_ref
            })
            return this.obj_sucess
        } catch(error) {
            return this.obj_error
        }
    }

    //Remove um exame do BD
    async delExame(id){
        try {
            await this.database('exame').where('idexame', id).del()
            return this.obj_sucess
        } catch(error) {
            throw this.obj_error
        }
    }

}

module.exports = exameDAO