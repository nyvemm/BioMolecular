class pacienteDAO {
  constructor(database) {
    this.database = database;
    this.obj_error = { status: 'error' };
    this.obj_success = { status: 'success' };
  }

  // Lista todos os pacientes
  async getPacientes(data) {
    try {
      const offset = data.offset ? data.offset : 0;
      const sort = data.sort ? data.sort : 'idPaciente';
      const pacientes = await this.database('paciente').select().offset(offset).orderBy(sort);

      for (let i = 0; i < pacientes.length; i += 1) {
        const diffTime = Math.abs(new Date() - pacientes[i].dt_nasc);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        pacientes[i].idade = Math.floor(diffDays / 365);
        pacientes[i].idade_meses = Math.floor((diffDays % 365) / 30);
      }
      return pacientes;
    } catch (error) {
      throw this.obj_error;
    }
  }

  // Lista paciente por seu id (chave primária)
  async getPaciente(id) {
    try {
      const paciente = await this.database('paciente').where('idPaciente', id).select();
      const diffTime = Math.abs(new Date() - paciente.dt_nasc);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      paciente.idade = Math.floor(diffDays / 365);
      paciente.idade_meses = Math.floor((diffDays % 365) / 30);
      return paciente;
    } catch (error) {
      throw this.obj_error;
    }
  }

  // Adiciona um novo paciente ao BD
  async addPaciente(data) {
    try {
      // eslint-disable-next-line camelcase
      const cadastrado_por = data.cadastrado_por ? data.cadastrado_por : null;
      await this.database('paciente').insert({
        nome: data.nome,
        dt_nasc: data.dt_nasc,
        recem_nascido: data.recem_nascido,
        etnia: data.etnia,
        sexo: data.sexo,
        naturalidade_cidade: data.naturalidade_cidade,
        naturalidade_estado: data.naturalidade_estado,
        observacao: data.observacao,
        cadastrado_por,
      });
      return this.obj_success;
    } catch (error) {
      throw this.obj_error;
    }
  }

  // Atualiza os dados de um paciente no BD
  async updatePaciente(data) {
    const id = data.idPaciente;
    try {
      await this.database('paciente').where('idPaciente', id).update({
        nome: data.nome,
        dt_nasc: data.dt_nasc,
        recem_nascido: data.recem_nascido,
        etnia: data.etnia,
        sexo: data.sexo,
        naturalidade_cidade: data.naturalidade_cidade,
        naturalidade_estado: data.naturalidade_estado,
        observacao: data.observacao,
      });
      return this.obj_success;
    } catch (error) {
      throw this.obj_error;
    }
  }

  // Remove um paciente do BD
  async deletePaciente(id) {
    try {
      await this.database('paciente').where('idPaciente', id).del();
      return this.obj_success;
    } catch (error) {
      throw this.obj_error;
    }
  }
}

export default pacienteDAO;
