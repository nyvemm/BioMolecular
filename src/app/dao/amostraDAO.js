const amostraController = require("../controller/amostraController")
const utilsDate = require('../../utils/date')

class amostraDAO {

    // O construtor recebe a conexão com o banco de dados.
    constructor(database) {
        this.database = database
        this.obj_error = { status: 'error' }
        this.obj_success = { status: 'success' }
    }

    //Lista todas as amostras.
    async getAmostras(data) {
        try {
            let offset = data.offset ? data.offset : 0
            let sort = data.sort ? data.sort : 'paciente.idpaciente'
            let amostras = await this.database('amostra').select(database.raw(`*, paciente.nome as paciente_nome, solicitante.nome as solicitante_nome`))
                .innerJoin('paciente', 'amostra.idpaciente', 'paciente.idpaciente')
                .innerJoin('solicitante', 'amostra.idsolicitante', 'solicitante.idsolicitante')
                .offset(offset).orderBy(sort)
            amostras.forEach((amostra) => {
                amostra.f_dt_recebimento = utilsDate.viewDateFormat(amostra.dt_recebimento)
                amostra.medicamentos = amostra.medicamentos.split(',')
            })
            return amostras
        } catch (error) {
            console.log(error)
            throw this.obj_error
        }
    }

    // Lista a amostra pela sua chave primária.
    async getAmostra(id) {
        try {
            let amostra = await this.database('amostra').where('idamostra', id).select(database.raw(`*, paciente.nome as paciente_nome, solicitante.nome as solicitante_nome`))
                .innerJoin('paciente', 'amostra.idpaciente', 'paciente.idpaciente')
                .innerJoin('solicitante', 'amostra.idsolicitante', 'solicitante.idsolicitante')
            const diffTime = Math.abs(new Date() - amostra[0].dt_nasc);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            amostra[0].f_dt_recebimento = utilsDate.viewDateFormat(amostra[0].dt_recebimento)
            amostra[0].idade = Math.floor(diffDays / 365)
            amostra[0].medicamentos = amostra[0].medicamentos.split(',')
            return amostra
        } catch (error) {
            throw this.obj_error
        }
    }

    //Adiciona um novo amostra ao banco de dados.
    async addAmostra(data) {

        //Verifica se o paciente e solicitante existem no banco de dados.   
        const hasPaciente = await this.database.select().from('paciente').where('idpaciente', data.idpaciente)
        const hasSolicitante = await this.database.select().from('solicitante').where('idsolicitante', data.idsolicitante)

        if (!hasPaciente.length)
            throw ({ status: 'error', message: 'O paciente informado não existe.' })
        if (!hasSolicitante.length)
            throw ({ status: 'error', message: 'O solicitante informado não existe.' })

        try {
            await this.database('amostra').insert({
                idpaciente: data.idpaciente,
                idsolicitante: data.idsolicitante,
                gestante: data.gestante ? data.gestante : false,
                semanas_gestacao: data.semanas_gestacao ? data.semanas_gestacao : 0,
                transfusao: data.transfusao ? data.transfusao : false,
                dt_ult_transfusao: data.dt_ult_transfusao ? data.dt_ult_transfusao : null,
                uso_hidroxiureia: data.uso_hidroxiureia ? data.uso_hidroxiureia : false,
                uso_medicamentos: data.uso_medicamentos ? data.uso_medicamentos : false,
                suspeita_diagnostico: data.suspeita_diagnostico ? data.suspeita_diagnostico : null,
                material: data.material,
                dt_coleta: data.dt_coleta ? data.dt_coleta : null,
                dt_recebimento: data.dt_recebimento ? data.dt_recebimento : null,
                dt_solicitacao: data.dt_solicitacao ? data.dt_solicitacao : null,
                codigo_barra: data.codigo_barra ? data.codigo_barra : null,
                status_pedido: data.status_pedido ? data.status_pedido : 'Não avaliado',
                cadastrado_por: data.cadastrado_por,
                medicamentos: data.medicamentos ? `${data.medicamentos}` : '[]',
            })

            //Cria resultados para exame.
            let insert_id = await this.database('amostra').max('idamostra')
            const promises = data.exames.split(',').map(exame => {
                return new Promise((resolve, reject) => {
                    this.database('amostra_contem_exames_aux').insert({
                        idamostra: insert_id[0].max,
                        idexame: parseInt(exame)
                    }).then((data) => {
                        resolve(this.obj_success)
                    }).catch((error) => {
                        reject(this.obj_error)
                    })
                })
            })

            await Promise.all(promises)
            return this.obj_success

        } catch (error) {
            console.log(error)
            throw this.obj_error
        }
    }

    //Atualiza uma amostra no banco de dados.
    async updateAmostra(data) {
        const id = data.idamostra
        try {
            await this.database('amostra').where('idamostra', id).update({
                interpretacao_resultados: data.interpretacao_resultados
            })
            return this.obj_success
        } catch (error) {
            console.log(error)
            return this.obj_error
        }
    }

    //Remove uma amostra do banco de dados.
    async removeAmostra(id) {
        try {
            let ids = await this.database('amostra_contem_exames_aux').distinct('idamostraexame')
                .innerJoin('amostra', 'amostra.idamostra', 'amostra_contem_exames_aux.idamostra')
                .select()
                
            ids = Array.from(ids).map(amostra=>amostra.idamostraexame)
            await this.database('resultados').whereIn('idamostraexame', ids).del()
            await this.database('amostra_contem_exames_aux').whereIn('idamostraexame', ids).del()
            await this.database('amostra').where('idamostra', id).del()
            return this.obj_success
        } catch (error) {
            console.log(error)
            throw this.obj_error
        }
    }

}

module.exports = amostraDAO