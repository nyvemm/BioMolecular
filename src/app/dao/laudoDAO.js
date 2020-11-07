class laudoDAO {

    obj_error = { status : 'error' }
    obj_sucess = { status : 'sucess' }

    constructor(database){
        this.database = database
    }

    //Lista todos os laudos
    async getLaudos(){
        try {
            return await this.database('laudo').select()
        } catch(error) {
            throw this.obj_error
        }
    }

    //Lista laudos por seu id (chave primária)
    async getLaudo(id){
        try {
            return await this.database('laudo').where('idlaudo', id).select()
        } catch(error) {
            throw this.obj_error
        }
    }
    
    //Adiciona um novo laudo ao BD
    async addLaudo(data){
        try {
            await this.database('laudo').insert({
                qtd_analise_eletroforeticas : data.qtd_analise_eletroforeticas,
                qtd_analise_citologicas : data.qtd_analise_citologicas,
                qtd_analise_cromotografica : data.qtd_analise_cromotografica,
                qtd_analise_molecular : data.qtd_analise_molecular,
                interpretacao_resultados : data.interpretacao_resultados,
                resultado : data.resultado,
                observacao : data.observacao,
                dt_liberacao : data.dt_liberacao
            })
            return this.obj_sucess
        } catch(error) {
            throw this.obj_error
        }
    }

    //Atualiza os dados de um laudo no BD
    async updLaudo(data){
        const id = data.idLaudo
        try {
            await this.database('laudo').where('idlaudo', id).update({
                qtd_analise_eletroforeticas : data.qtd_analise_eletroforeticas,
                qtd_analise_citologicas : data.qtd_analise_citologicas,
                qtd_analise_cromotografica : data.qtd_analise_cromotografica,
                qtd_analise_molecular : data.qtd_analise_molecular,
                interpretacao_resultados : data.interpretacao_resultados,
                resultado : data.resultado,
                observacao : data.observacao,
                dt_liberacao : data.dt_liberacao
            })
            return this.obj_sucess
        } catch(error) {
            throw this.obj_error
        }
    }

    //Remove um laudo do BD
    async delLaudo(id){
        try {
            await this.database('laudo').where('idlaudo', id).del()
            return this.obj_sucess
        } catch(error) {
            throw this.obj_error
        }
    }

}

module.exports = laudoDAO