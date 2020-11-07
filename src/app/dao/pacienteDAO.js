class pacienteDAO {

    obj_error = { status : 'error' }
    obj_sucess = { status : 'sucess' }

    constructor(database){
        this.database = database
    }

    //Lista todos os pacientes
    async getPacientes(){
        try{
            return await this.database('paciente').select()
        } catch (error) {
            throw this.obj_error
        }
    }

    //Lista paciente por seu id (chave primária)
    async getPaciente(id){
        try {
            return await this.database('paciente').where('idpaciente', id).select()
        } catch (error) {
            throw this.obj_error
        }
    }

    //Adiciona um novo usuário ao BD
    async addPaciente(data){
        try {
            await this.database('paciente').insert({
                idpacientesolicitante : data.idPacienteSolicitante,
                nome : data.nome,
                dt_nasc : data.dt_nasc,
                etnia : data.etnia,
                sexo : data.sexo,
                naturalidade_cidade : data.naturalidade_cidade,
                naturalidade_estado : data.naturalidade_estado
            })
            return this.obj_sucess
        } catch (error) {
            throw this.obj_error
        }
    }

    //Atualiza os dados de um paciente no BD
    async updPaciente(data){
        const id = data.idPaciente
        try {
            await this.database('paciente').where('idpaciente', id).update({
                idpacientesolicitante : data.idPacienteSolicitante,
                nome : data.nome,
                dt_nasc : data.dt_nasc,
                etnia : data.etnia,
                sexo : data.sexo,
                naturalidade_cidade : data.naturalidade_cidade,
                naturalidade_estado : data.naturalidade_estado
            })
            return this.obj_sucess
        } catch(error) {
            throw this.obj_error
        }
    }

    //Remove um paciente do BD
    async delPaciente(id){
        try {
            await this.database('paciente').where('idpaciente', id).del()
            return this.obj_sucess
        } catch(error) {
            throw this.obj_error
        }
    }
}

module.exports = pacienteDAO