CREATE TABLE IF NOT EXISTS usuario(
	login VARCHAR(50),
	senha VARCHAR(50) NOT NULL,
	nome VARCHAR(100) NOT NULL,
	email VARCHAR(50) NOT NULL,
	administrador BOOLEAN DEFAULT False,
	foto VARCHAR(50),
	token VARCHAR(50),

	PRIMARY KEY(login),
	CONSTRAINT CHK_email CHECK(email LIKE '%@%.___' OR email LIKE '%@%.___.__')
);

CREATE TABLE IF NOT EXISTS paciente(
  	idPaciente SERIAL,
  	nome VARCHAR(75) NOT NULL,
	dt_nasc DATE NOT NULL,
	etnia VARCHAR(45) NULL,
	recem_nascido BOOLEAN NULL,
	sexo CHAR NOT NULL,
	naturalidade_cidade VARCHAR(45) NULL,
	naturalidade_estado VARCHAR(2) NULL,
	observacao TEXT,
	cadastrado_em DATE DEFAULT NOW(),
	cadastrado_por VARCHAR(100),
	
	CONSTRAINT pk_paciente PRIMARY KEY (idPaciente)
);

CREATE TABLE IF NOT EXISTS exame(
	idExame SERIAL,
	nome VARCHAR(75) NOT NULL,
	sigla VARCHAR(15) NULL,
	tipo_analise VARCHAR(45) NOT NULL,
	metodo VARCHAR(75) NOT NULL,
	preco DECIMAL(10,2) NULL,
	valor_ref VARCHAR(45) NOT NULL,
	tipo_valor_ref VARCHAR(45) NOT NULL,
	cadastrado_em DATE DEFAULT NOW(),
	cadastrado_por VARCHAR(100),
	observacao TEXT,
	tabela_intervalo TEXT,

	CONSTRAINT pk_exames PRIMARY KEY (idExame)
	/*CONSTRAINT tipo_valido CHECK(tipo_analise = 'Análise Citológica' or tipo_analise = 'Análise Eletroforética' or tipo_analise = 'Análise Cromatográfica' or tipo_analise = 'Análise Molecular') */
);

CREATE TABLE IF NOT EXISTS solicitante(
	idSolicitante SERIAL,
	nome VARCHAR(45) NOT NULL,
	estado VARCHAR(2) NULL,
	cidade VARCHAR(100) NULL,
	endereco VARCHAR(100) NULL,
	e_mail VARCHAR(45) NULL,
	contato_referencia VARCHAR(45) NULL,
	codigo_barra_solicitante VARCHAR(45) NULL,
	observacao TEXT NULL,
	cadastrado_em DATE DEFAULT NOW(),
	cadastrado_por VARCHAR(100),

	CONSTRAINT pk_solicitante PRIMARY KEY (idSolicitante)
);

CREATE TABLE IF NOT EXISTS amostra(
	idAmostra SERIAL,
	idPaciente INT NOT NULL,
	idSolicitante INT NOT NULL,
	material VARCHAR(45) NOT NULL,
	dt_coleta DATE  NOT NULL,
	dt_recebimento DATE NULL,
	dt_solicitacao DATE NULL,
	gestante BOOLEAN NULL,
	semanas_gestacao INT NULL,
	transfusao BOOLEAN NULL,
	dt_ult_transfusao DATE NULL,
	codigo_barra VARCHAR(45) NULL,
	suspeita_diagnostico VARCHAR(45) NULL,
	uso_hidroxiureia BOOLEAN NULL,
	uso_medicamentos BOOLEAN NULL,
	medicamentos TEXT NULL,
	interpretacao_resultados TEXT NULL,
	dt_liberacao DATE NULL,
	status_pedido VARCHAR(45) NULL DEFAULT 'Não avaliado',
	observacao TEXT,
	solicitacao VARCHAR(100),
	resultado TEXT,
	cadastrado_em DATE DEFAULT NOW(),
	cadastrado_por VARCHAR(100),
	
	CONSTRAINT pk_amostra PRIMARY KEY (idAmostra),
	CONSTRAINT fk_idPaciente FOREIGN KEY (idPaciente) REFERENCES paciente(idPaciente),
	CONSTRAINT fk_idSolicitante FOREIGN KEY (idSolicitante) REFERENCES solicitante(idSolicitante)
);

CREATE TABLE IF NOT EXISTS amostra_contem_exames_aux(
	idAmostraExame SERIAL,
	idAmostra INT NOT NULL,
	idExame INT NOT NULL,
	status BOOLEAN DEFAULT FALSE,
	liberado_em DATE NULL,
	cadastrado_por VARCHAR(100) NULL,
	
	CONSTRAINT pk_amostra_exame PRIMARY KEY (idAmostraExame),
	CONSTRAINT fk_idAmostra FOREIGN KEY (idAmostra) REFERENCES amostra(idAmostra),
	CONSTRAINT fk_idExame FOREIGN KEY (idExame) REFERENCES exame(idExame)
);

CREATE TABLE IF NOT EXISTS resultados(
	idResultado SERIAL NOT NULL,
	idAmostraExame INT NOT NULL,
	valor_resultado TEXT,
	observacao_resultado TEXT,
	
	CONSTRAINT pk_resultado PRIMARY KEY (idResultado),
	CONSTRAINT fk_idAmostraExame FOREIGN KEY (idAmostraExame) REFERENCES amostra_contem_exames_aux(idAmostraExame)
);