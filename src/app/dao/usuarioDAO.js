class usuarioDAO {

    obj_error = { status: 'error' }
    obj_success = { status: 'success' }

    // O construtor recebe a conexão com o banco de dados.
    constructor(database) {
        this.database = database
    }

    //Lista dados de todos os clientes.
    async getUsuarios() {
        try {
            return await this.database('usuario').select()
        } catch (error) {
            throw this.obj_error
        }
    }

    // Lista o usuário pela sua chave primária.
    async getUsuario(login) {
        try {
            return await this.database('usuario').where('login', login).select()
        } catch (error) {
            throw this.obj_error
        }
    }

    //Adiciona um novo usuário ao banco de dados.
    async addUsuario(data) {
        //Verifica se o usuário existe no banco de dados.   
        const hasUsuario = await this.database.select().from('usuario').where('login', data.login)

        console.log(hasUsuario)
        if (hasUsuario.length > 0)
            throw ({ status: 'error', message: 'Já existe um um usuário com esse login.' })

        try {
            await this.database('usuario').insert({
                login: data.login,
                senha: data.senha,
                nome: data.nome,
                email: data.email,
                foto: data.foto
            })
            return this.obj_success
        } catch (error) {
            throw this.obj_error
        }
    }

    // Atualiza um usuário no banco de dados.
    async updateUsuario(data) {
        const login = data.login
        try {
            await this.database('usuario').where('login', login).update({
                senha: data.senha,
                nome: data.nome,
                email: data.email,
                foto: data.foto
            })
            return this.obj_success
        } catch (error) {
            throw this.obj_error
        }
    }

    //Remove um usuário do banco de dados.
    async removeUsuario(login) {
        try {
            await this.database('usuario').where('login', login).del()
            return this.obj_success
        } catch (error) {
            throw this.obj_error
        }
    }
}

module.exports = usuarioDAO