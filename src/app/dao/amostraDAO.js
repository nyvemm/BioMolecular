// eslint-disable-next-line import/extensions
import dateUtils from '../../utils/date.js';

const { viewDateFormat } = dateUtils;

class amostraDAO {
  // O construtor recebe a conexão com o banco de dados.
  constructor(database) {
    this.database = database;
    this.obj_error = { status: 'error' };
    this.obj_success = { status: 'success' };
  }

  // Lista todas as amostras.
  async getAmostras(data) {
    try {
      const offset = data.offset ? data.offset : 0;
      const sort = data.sort ? data.sort : 'paciente.idPaciente';
      const amostras = await this.database('amostra').select(this.database.raw('*, paciente.nome as paciente_nome, solicitante.nome as solicitante_nome, amostra.observacao as observacao'))
        .innerJoin('paciente', 'amostra.idPaciente', 'paciente.idPaciente')
        .innerJoin('solicitante', 'amostra.idSolicitante', 'solicitante.idSolicitante')
        .offset(offset)
        .orderBy(sort);
      for (let i = 0; i < amostras.length; i += 1) {
        const diffTime = Math.abs(new Date() - amostras[i].dt_nasc);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        amostras[i].idade = Math.floor(diffDays / 365);
        amostras[i].idade_meses = Math.floor((diffDays % 365) / 30);
        amostras[i].f_dt_recebimento = viewDateFormat(amostras[i].dt_recebimento);
        amostras[i].f_dt_coleta = viewDateFormat(amostras[i].dt_coleta);
        amostras[i].f_dt_solicitacao = viewDateFormat(amostras[i].dt_solicitacao);
        amostras[i].medicamentos = JSON.parse(amostras[i].medicamentos).length > 0 ? JSON.parse(amostras[i].medicamentos).split(',') : null;
      }

      return amostras;
    } catch (error) {
      throw this.obj_error;
    }
  }

  // Lista a amostra pela sua chave primária.
  async getAmostra(id) {
    try {
      const amostraAtual = await this.database('amostra').where('idAmostra', id).select(this.database.raw(`*, paciente.nome as paciente_nome, solicitante.nome as solicitante_nome, amostra.cadastrado_por as cadastrado_por
                , amostra.observacao as observacao`))
        .innerJoin('paciente', 'amostra.idPaciente', 'paciente.idPaciente')
        .innerJoin('solicitante', 'amostra.idSolicitante', 'solicitante.idSolicitante');
      const diffTime = Math.abs(new Date() - amostraAtual[0].dt_nasc);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      amostraAtual[0].f_dt_recebimento = viewDateFormat(amostraAtual[0].dt_recebimento);
      amostraAtual[0].f_dt_coleta = viewDateFormat(amostraAtual[0].dt_coleta);
      amostraAtual[0].idade = Math.floor(diffDays / 365);
      amostraAtual[0].idade_meses = Math.floor((diffDays % 365) / 30);
      amostraAtual[0].medicamentos = amostraAtual[0].medicamentos ? amostraAtual[0].medicamentos.split(',') : [];
      amostraAtual[0].dt_liberacao = viewDateFormat(amostraAtual[0].dt_liberacao);

      return amostraAtual;
    } catch (error) {
      throw this.obj_error;
    }
  }

  // Adiciona um novo amostra ao banco de dados.
  async addAmostra(data) {
    try {
      // Verifica se o paciente e solicitante existem no banco de dados.
      const hasPaciente = await this.database.select().from('paciente').where('idPaciente', data.idPaciente);
      const hasSolicitante = await this.database.select().from('solicitante').where('idSolicitante', data.idSolicitante);

      if (!hasPaciente.length) throw new Error({ status: 'error', message: 'O paciente informado não existe.' });
      if (!hasSolicitante.length) throw new Error({ status: 'error', message: 'O solicitante informado não existe.' });

      // Pega a lista de códigos já no banco de dados.
      let codsAmostra = await this.database('amostra').whereNotNull('cod');
      codsAmostra = Array.from(codsAmostra).map((x) => x.cod);

      let cod;
      do {
        cod = `${Math.floor(Math.random() * 89999) + 10000}/${new Date().getFullYear() % 100}`;
      } while (codsAmostra.includes(cod));
      await this.database('amostra').insert({
        cod,
        idPaciente: data.idPaciente,
        idSolicitante: data.idSolicitante,
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
        solicitacao: data.solicitacao ? data.solicitacao : null,
        cadastrado_por: data.cadastrado_por,
        cadastrado_em: new Date(),
        medicamentos: data.medicamentos ? `${data.medicamentos}` : '[]',
      });

      // Cria resultados para exame.
      const insertID = await this.database('amostra').max('idAmostra').first();
      const promises = data.exames.split(',').map((exame) => new Promise((resolve, reject) => {
        this.database('amostra_contem_exames_aux').insert({
          idAmostra: insertID['max(`idAmostra`)'],
          idExame: parseInt(exame, 10),
        }).then(() => {
          resolve(this.obj_success);
        }).catch(() => {
          reject(this.obj_error);
        });
      }));

      await Promise.all(promises);
      return this.obj_success;
    } catch (error) {
      throw this.obj_error;
    }
  }

  // Atualiza uma amostra no banco de dados.
  async updateAmostra(data) {
    const id = data.idAmostra;
    try {
      await this.database('amostra').where('idAmostra', id).update({
        solicitacao: data.solicitacao ? data.solicitacao : null,
        gestante: data.gestante ? data.gestante : null,
        semanas_gestacao: data.semanas_gestacao ? data.semanas_gestacao : null,
        transfusao: data.transfusao ? data.transfusao : null,
        dt_ult_transfusao: data.dt_ult_transfusao ? data.dt_ult_transfusao : null,
        suspeita_diagnostico: data.suspeita_diagnostico ? data.suspeita_diagnostico : null,
        material: data.material ? data.material : null,
        dt_solicitacao: data.dt_solicitacao ? data.dt_solicitacao : null,
        dt_coleta: data.dt_coleta ? data.dt_coleta : null,
        dt_recebimento: data.dt_recebimento ? data.dt_recebimento : null,
        codigo_barra: data.codigo_barra ? data.codigo_barra : null,
        observacao: data.observacao ? data.observacao : null,
      });
      return this.obj_success;
    } catch (error) {
      return this.obj_error;
    }
  }

  // Remove uma amostra do banco de dados.
  async removeAmostra(id) {
    try {
      let ids = await this.database('amostra_contem_exames_aux').distinct('idAmostraExame')
        .innerJoin('amostra', 'amostra.idAmostra', 'amostra_contem_exames_aux.idAmostra')
        .where('amostra.idAmostra', id)
        .select();

      ids = Array.from(ids).map((a) => a.idAmostraExame);
      await this.database('resultados').whereIn('idAmostraExame', ids).del();
      await this.database('amostra_contem_exames_aux').whereIn('idAmostraExame', ids).del();
      await this.database('amostra').where('idAmostra', id).del();
      return this.obj_success;
    } catch (error) {
      throw this.obj_error;
    }
  }
}

export default amostraDAO;
