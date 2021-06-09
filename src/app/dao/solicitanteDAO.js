const passGenerator = require('generate-password');

class solicitanteDAO {
  // O construtor recebe a conexão com o banco de dados.
  constructor(database) {
    this.database = database;
    this.obj_error = { status: 'error' };
    this.obj_success = { status: 'success' };
  }

  // Lista dados de todos os solicitantes.
  async getSolicitantes(data) {
    try {
      const offset = data.offset ? data.offset : 0;
      const sort = data.sort ? data.sort : 'idSolicitante';
      return await this.database('solicitante').select().offset(offset).orderBy(sort);
    } catch (error) {
      throw this.obj_error;
    }
  }

  // Lista o solicitante pela sua chave primária.
  async getSolicitante(id) {
    try {
      return await this.database('solicitante').where('idSolicitante', id).select();
    } catch (error) {
      throw this.obj_error;
    }
  }

  // Adiciona um novo solicitante ao banco de dados.
  async addSolicitante(data) {
    try {
      /* Lista dos valores já gerados */
      let listValidLogin = await this.database('solicitante').select('login_visitante').whereNotNull('login_visitante');
      listValidLogin = listValidLogin.map((x) => x.login_visitante.split('.')[1]);

      /* Gera um identificador que não se repete */
      let loginNum;
      do {
        loginNum = passGenerator.generate({ length: 5, numbers: true, uppercase: false });
      } while (listValidLogin.includes(loginNum));

      const loginVisitante = `${data.nome.split(' ')[0].replaceAll('.', '').toLowerCase()}.${loginNum}`;
      const senhaVisitante = passGenerator.generate({ length: 8, numbers: true });

      await this.database('solicitante').insert({
        nome: data.nome,
        estado: data.estado,
        cidade: data.cidade,
        endereco: data.endereco,
        e_mail: data.e_mail,
        contato_referencia: data.contato_referencia,
        observacao: data.observacao,
        cadastrado_por: data.cadastrado_por,
        login_visitante: loginVisitante,
        senha_visitante: senhaVisitante,
      });

      // Adiciona um novo usuário baseado no solicitante.
      await this.database('usuario').insert({
        login: loginVisitante,
        senha: senhaVisitante,
        nome: data.nome,
        email: data.e_mail,
        administrador: false,
        foto: null,
        solicitante: true,
      });

      return this.obj_success;
    } catch (error) {
      throw this.obj_error;
    }
  }

  // Atualiza um usuário no banco de dados.
  async updateSolicitante(data) {
    const id = data.idSolicitante;
    try {
      await this.database('solicitante').where('idSolicitante', id).update({
        nome: data.nome,
        estado: data.estado,
        cidade: data.cidade,
        endereco: data.endereco,
        e_mail: data.e_mail,
        observacao: data.observacao,
        contato_referencia: data.contato_referencia,
        cadastrado_por: data.cadastrado_por,
      });
      return this.obj_success;
    } catch (error) {
      throw this.obj_error;
    }
  }

  // Remove um solicitante do banco de dados.
  async removeSolicitante(id) {
    try {
      const { login_visitante } = await this.database('solicitante')
        .where('idSolicitante', id).select('login_visitante').first();

      await this.database('usuario').where('login', login_visitante).del();
      await this.database('solicitante').where('idSolicitante', id).del();
      return this.obj_success;
    } catch (error) {
      throw this.obj_error;
    }
  }
}

module.exports =  solicitanteDAO;
