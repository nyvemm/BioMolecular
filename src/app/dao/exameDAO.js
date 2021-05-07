class exameDAO {
  constructor(database) {
    this.database = database;
    this.obj_error = { status: 'error' };
    this.obj_success = { status: 'success' };
  }

  // Lista todos os exames
  async getExames(data) {
    try {
      const offset = data.offset ? data.offset : 0;
      const sort = data.sort ? data.sort : 'idExame';
      return await this.database('exame').select().offset(offset).orderBy(sort);
    } catch (error) {
      throw this.obj_error;
    }
  }

  // Lista exame por seu id (chave primária)
  async getExame(id) {
    try {
      return await this.database('exame').where('idExame', id).select();
    } catch (error) {
      throw this.obj_error;
    }
  }

  // Adiciona um novo exame ao BD
  async addExame(data) {
    try {
      await this.database('exame').insert({
        nome: data.nome,
        sigla: data.sigla,
        tipo_analise: data.tipo_analise,
        metodo: data.metodo,
        valor_ref: data.valor_ref,
        tipo_valor_ref: data.tipo_valor_ref,
        preco: data.preco ? data.preco : 0,
        observacao: data.observacao,
        cadastrado_por: data.cadastrado_por,
        cadastrado_em: new Date(),
        tabela_intervalo: data.tabela_intervalo ? data.tabela_intervalo : null,
      });
      return this.obj_success;
    } catch (error) {
      throw this.obj_error;
    }
  }

  // Atualiza os dados de um exame no BD
  async updateExame(data) {
    const id = data.idExame;
    try {
      await this.database('exame').where('idExame', id).update({
        nome: data.nome,
        sigla: data.sigla,
        tipo_analise: data.tipo_analise,
        metodo: data.metodo,
        preco: data.preco ? data.preco : 0,
        valor_ref: data.valor_ref,
        tipo_valor_ref: data.tipo_valor_ref,
        observacao: data.observacao,
        tabela_intervalo: data.tabela_intervalo ? data.tabela_intervalo : null,
      });
      return this.obj_success;
    } catch (error) {
      return this.obj_error;
    }
  }

  // Remove um exame do BD
  async deleteExame(id) {
    try {
      await this.database('exame').where('idExame', id).del();
      return this.obj_success;
    } catch (error) {
      throw this.obj_error;
    }
  }
}

export default exameDAO;
