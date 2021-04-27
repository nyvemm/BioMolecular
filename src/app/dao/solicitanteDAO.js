class solicitanteDAO {


    // O construtor recebe a conexão com o banco de dados.
    constructor(database) {
        this.database = database
        this.obj_error = { status: 'error' }
        this.obj_success = { status: 'success' }
    }

    //Lista dados de todos os solicitantes.
    async getSolicitantes(data) {
        try {
            let offset = data.offset ? data.offset : 0
            let sort = data.sort ? data.sort : 'idSolicitante'
            return await this.database('solicitante').select().offset(offset).orderBy(sort)
        } catch (error) {
            throw this.obj_error
        }
    }

    // Lista o solicitante pela sua chave primária.
    async getSolicitante(id) {
        try {
            return await this.database('solicitante').where('idSolicitante', id).select()
        } catch (error) {
            throw this.obj_error
        }
    }

    //Adiciona um novo solicitante ao banco de dados.
    async addSolicitante(data) {
        try {
            await this.database('solicitante').insert({
                nome: data.nome,
                estado: data.estado,
                cidade: data.cidade,
                endereco: data.endereco,
                e_mail: data.e_mail,
                contato_referencia: data.contato_referencia,
                observacao: data.observacao,
                cadastrado_por: data.cadastrado_por
            })
            return this.obj_success
        } catch (error) {
            throw this.obj_error
        }
    }

    // Atualiza um usuário no banco de dados.
    async updateSolicitante(data) {
        const id = data.idSolicitante
        try {
            await this.database('solicitante').where('idSolicitante', id).update({
                nome: data.nome,
                estado: data.estado,
                cidade: data.cidade,
                endereco: data.endereco,
                e_mail: data.e_mail,
                observacao: data.observacao,
                contato_referencia: data.contato_referencia,
                cadastrado_por: data.cadastrado_por
            })
            return this.obj_success
        } catch (error) {
            throw this.obj_error
        }
    }

    //Remove um solicitante do banco de dados.
    async removeSolicitante(id) {
        try {
            await this.database('solicitante').where('idSolicitante', id).del()
            return this.obj_success
        } catch (error) {
            throw this.obj_error
        }
    }
}

module.exports = solicitanteDAO