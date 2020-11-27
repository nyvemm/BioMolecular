const pedidoController = require('../controller/pedidoController')

class pedidoDAO {

    obj_error = { status: 'error' }
    obj_sucess = { status: 'sucess' }

    constructor(database) {
        this.database = database
    }

    //Lista todos os pedidos
    async getPedidos() {
        try {
            return await this.database('pedido').select()
        } catch (error) {
            throw this.obj_error
        }
    }

    //Lista o pedido por sua chave primária
    async getPedido(id) {
        try {
            return await this.database('pedido').where('idPedido', id).select()
        } catch(error) {
            throw this.obj_error
        }
    }

    //Adiciona um novo pedido ao BD
    async addPedido(data) {

        //Verifica a existência do paciente, amostra e/ou laudo
        const hasPaciente = await this.database.select().from('paciente').where('idpaciente', data.idPaciente)
        const hasAmostra = await this.database.select().from('amostra').where('idamostra', data.idAmostra)
        const hasLaudo = await this.database.select().from('laudo').where('idlaudo', data.idLaudo)

        if(!hasPaciente.length)
            throw ({ status: 'error', message: 'O paciente informado não existe.' })
        if(!hasAmostra.length)
            throw ({ status: 'error', message: 'A amostra informada não existe.' })
        if(!hasLaudo)
            throw ({ status: 'error', message: 'O laudo informado não existe.' })
        
        try {
            await this.database('pedido').insert({
                idamostra : data.idAmostra,
                idlaudo : data.idLaudo,
                idpaciente : data.idPaciente,
                valor_resultado_exame : data.valor_resultado,
                resultado_texto : data.resultado_texto,
                dt_liberacao : data.dt_liberacao,
                info : data.info,
                status_pedido : data.status_pedido
            })
            return this.obj_sucess
        } catch (error) {
            return this.obj_error
        }
    }

    //Atualiza o pedido informado no BD
    async updatePedido(data) {
        const id = data.idPedido

        //Verifica a existência do paciente, amostra e/ou laudo
        const hasPaciente = await this.database.select().from('paciente').where('idpaciente', data.idPaciente)
        const hasAmostra = await this.database.select().from('amostra').where('idamostra', data.idAmostra)
        const hasLaudo = await this.database.select().from('laudo').where('idlaudo', data.idLaudo)

        if(!hasPaciente.length)
            throw ({ status: 'error', message: 'O paciente informado não existe.' })
        if(!hasAmostra.length)
            throw ({ status: 'error', message: 'A amostra informada não existe.' })
        if(!hasLaudo)
            throw ({ status: 'error', message: 'O laudo informado não existe.' })
        
        try {
            await this.database('pedido').where('idpedido', id).update({
                idamostra : data.idAmostra,
                idlaudo : data.idLaudo,
                idpaciente : data.idPaciente,
                valor_resultado_exame : data.valor_resultado,
                resultado_texto : data.resultado_texto,
                dt_liberacao : data.dt_liberacao,
                info : data.info,
                status_pedido : data.status_pedido
            })
            return this.obj_sucess
        } catch (error) {
            return this.obj_error
        }
    }

    //Remove um pedido do BD
    async removePedido(id) {
        try {
            await this.database('pedido').where('idpedido', id).del()
            throw this.obj_sucess
        } catch (error) {
            throw this.obj_error
        }
    }

}

module.exports = pedidoDAO