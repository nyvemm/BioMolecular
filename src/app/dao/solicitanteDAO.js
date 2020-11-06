class solicitanteDAO {

    obj_error = { status: 'error' }
    obj_success = { status: 'success' }

    // O construtor recebe a conexão com o banco de dados.
    constructor(database) {
        this.database = database
    }

    //Lista dados de todos os solicitantes.
    async getSolicitantes() {
        try {
            return await this.database('solicitante').select()
        } catch (error) {
            throw this.obj_error
        }
    }

    // Lista o solicitante pela sua chave primária.
    async getSolicitante(id) {
        try {
            return await this.database('solicitante').where('idsolicitante', id).select()
        } catch (error) {
            throw this.obj_error
        }
    }

    //Adiciona um novo solicitante ao banco de dados.
    async addSolicitante(data) {
        try {
            console.log(data)
            await this.database('solicitante').insert({
                nome: data.nome,
                estado: data.estado,
                cidade: data.cidade,
                endereco: data.endereco,
                e_mail: data.email,
                contato_referencia: data.contato
            })
            return this.obj_success
        } catch (error) {
            console.log(error)
            throw this.obj_error
        }
    }

    // Atualiza um usuário no banco de dados.
    async updateSolicitante(data) {
        const id = data.idSolicitante
        try {
            await this.database('solicitante').where('idsolicitante', id).update({
                nome: data.nome,
                estado: data.estado,
                cidade: data.cidade,
                endereco: data.endereco,
                e_mail: data.e_mail,
                contato_referencia: data.contato_referencia
            })
            return this.obj_success
        } catch (error) {
            console.log(error)
            throw this.obj_error
        }
    }

    //Remove um solicitante do banco de dados.
    async removeSolicitante(id) {
        try {
            await this.database('solicitante').where('idsolicitante', id).del()
            return this.obj_success
        } catch (error) {
            throw this.obj_error
        }
    }
}

module.exports = solicitanteDAO