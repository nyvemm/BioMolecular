const amostraController = require("../controller/amostraController")

class amostraDAO {

    obj_error = { status: 'error' }
    obj_sucess = { status: 'success' }

    // O construtor recebe a conexão com o banco de dados.
    constructor(database) {
        this.database = database
    }

    //Lista todas as amostras.
    async getAmostras() {
        try {
            return await this.database('amostra').select()
        } catch (error) {
            throw this.obj_error
        }
    }

    // Lista a amostra pela sua chave primária.
    async getAmostra(id) {
        try {
            return await this.database('amostra').where('idamostra', id).select()
        } catch (error) {
            console.log(error)
            throw this.obj_error
        }
    }

    //Adiciona um novo amostra ao banco de dados.
    async addAmostra(data) {
        try {
            await this.database('amostra').insert({
                idpaciente: data.idpaciente,
                idsolicitante: data.idsolicitante,
                material: data.material,
                dt_coleta: data.dt_coleta,
                dt_recebimento: data.dt_recebimento,
                dt_solicitacao: data.dt_solicitacao,
                recem_nascido: data.recem_nascido,
                semanas_gestacao: data.semanas_gestacao,
                transfusao: data.transfusao,
                dt_ult_transfusao: data.dt_ult_transfusao,
                codigo_barra_solicitante: data.codigo_barra_solicitante,
                uso_hidroxiureia: data.uso_hidroxiureia,
                uso_medicamentos: data.uso_medicamentos,
                medicamentos: data.medicamentos,
                solicitacao_exame: data.solicitacao_exame
            })
            return this.obj_sucess
        } catch (error) {
            console.log(error)
            throw this.obj_error
        }
    }

    //Atualiza uma amostra no banco de dados.
    async updateAmostra(data) {
        const id = data.idAmostra
        try {
            await this.database('amostra').where('idamostra', id).update({
                idpaciente: data.idpaciente,
                idsolicitante: data.idsolicitante,
                material: data.material,
                dt_coleta: data.dt_coleta,
                dt_recebimento: data.dt_recebimento,
                dt_solicitacao: data.dt_solicitacao,
                recem_nascido: data.recem_nascido,
                semanas_gestacao: data.semanas_gestacao,
                transfusao: data.transfusao,
                dt_ult_transfusao: data.dt_ult_transfusao,
                codigo_barra_solicitante: data.codigo_barra_solicitante,
                uso_hidroxiureia: data.uso_hidroxiureia,
                uso_medicamentos: data.uso_medicamentos,
                medicamentos: data.medicamentos,
                solicitacao_exame: data.solicitacao_exame
            })
            return this.obj_sucess
        } catch (error) {
            console.log(error)
            return this.obj_error
        }
    }

    //Remove uma amostra do banco de dados.
    async removeAmostra(id) {
        try {
            await this.database('amostra').where('idamostra', id).del()
            return this.obj_sucess
        } catch (error) {
            console.log(error)
            throw this.obj_error
        }
    }

}

module.exports = amostraDAO