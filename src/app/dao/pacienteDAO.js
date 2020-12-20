class pacienteDAO {

    constructor(database) {
        this.database = database
        this.obj_error = { status: 'error' }
        this.obj_success = { status: 'success' }
    }

    //Lista todos os pacientes
    async getPacientes(data) {
        try {
            let offset = data.offset ? data.offset : 0
            let sort = data.sort ? data.sort : 'idpaciente'
            let pacientes = await this.database('paciente').select().offset(offset).orderBy(sort)

            pacientes.forEach((paciente) => {
                const diffTime = Math.abs(new Date() - paciente.dt_nasc);
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                paciente.idade = Math.floor(diffDays / 365)
                paciente.idade_meses = Math.floor((diffDays % 365) / 30)
            })

            return pacientes
        } catch (error) {
            throw this.obj_error
        }
    }

    //Lista paciente por seu id (chave primária)
    async getPaciente(id) {
        try {
            let paciente = await this.database('paciente').where('idpaciente', id).select()
            const diffTime = Math.abs(new Date() - paciente.dt_nasc);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            paciente.idade = Math.floor(diffDays / 365)
            paciente.idade_meses = Math.floor((diffDays % 365) / 30)
            return paciente
        } catch (error) {
            throw this.obj_error
        }
    }

    //Adiciona um novo paciente ao BD
    async addPaciente(data) {
        try {
            let cadastrado_por = data.cadastrado_por ? data.cadastrado_por : null
            await this.database('paciente').insert({
                nome: data.nome,
                dt_nasc: data.dt_nasc,
                recem_nascido: data.recem_nascido,
                etnia: data.etnia,
                sexo: data.sexo,
                naturalidade_cidade: data.naturalidade_cidade,
                naturalidade_estado: data.naturalidade_estado,
                observacao: data.observacao,
                cadastrado_por: cadastrado_por
            })
            return this.obj_success
        } catch (error) {
            throw this.obj_error
        }
    }

    //Atualiza os dados de um paciente no BD
    async updatePaciente(data) {
        const id = data.idpaciente
        try {
            await this.database('paciente').where('idpaciente', id).update({
                nome: data.nome,
                dt_nasc: data.dt_nasc,
                recem_nascido: data.recem_nascido,
                etnia: data.etnia,
                sexo: data.sexo,
                naturalidade_cidade: data.naturalidade_cidade,
                naturalidade_estado: data.naturalidade_estado,
                observacao: data.observacao
            })
            return this.obj_success
        } catch (error) {
            throw this.obj_error
        }
    }

    //Remove um paciente do BD
    async deletePaciente(id) {
        try {
            await this.database('paciente').where('idpaciente', id).del()
            return this.obj_success
        } catch (error) {
            throw this.obj_error
        }
    }
}

module.exports = pacienteDAO