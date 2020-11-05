CREATE TABLE IF NOT EXISTS usuario(
	login VARCHAR(50),
	senha VARCHAR(50) NOT NULL,
	nome VARCHAR(100) NOT NULL,
	email VARCHAR(50) NOT NULL,
	foto VARCHAR(50),
	token VARCHAR(50),

	PRIMARY KEY(login),
	CONSTRAINT CHK_email CHECK(email LIKE '%@%.___' OR email LIKE '%@%.___.__')
);

CREATE TABLE IF NOT EXISTS paciente(
  	idPaciente SERIAL,
  	idPacienteSolicitante INT NOT NULL,
  	nome VARCHAR(75) NOT NULL,
	dt_nasc DATE NOT NULL,
	etnia VARCHAR(45) NULL,
	sexo CHAR NOT NULL,
	naturalidade_cidade VARCHAR(45) NULL,
	naturailidade_estado VARCHAR(2) NULL,
	
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

	CONSTRAINT pk_exames PRIMARY KEY (idExame),
	CONSTRAINT tipo_valido CHECK(tipo_analise = 'Análise Citológica' or tipo_analise = 'Análise Eletroforética' or tipo_analise = 'Análise Cromatográfica' or tipo_analise = 'Análise Molecular')
);

CREATE TABLE IF NOT EXISTS solicitante(
	idSolicitante SERIAL,
	nome VARCHAR(45) NOT NULL,
	estado VARCHAR(2) NULL,
	cidade VARCHAR(100) NULL,
	endereco VARCHAR(100) NULL,
	e_mail VARCHAR(45) NULL,
	contato_referencia VARCHAR(45) NULL,

	CONSTRAINT pk_solicitante PRIMARY KEY (idSolicitante)
);

CREATE TABLE IF NOT EXISTS amostra(
	idAmostra SERIAL,
	idPaciente INT NOT NULL,
	idSolicitante INT NOT NULL,
	material VARCHAR(45) NOT NULL,
	dt_coleta DATE NOT NULL,
	dt_recebimento DATE NOT NULL,
	idade_coleta DATE NULL,
	idade_atual INT NULL,
	dt_solicitacao DATE NULL,
	recem_nascido SMALLINT NULL,
	semanas_gestacao INT NULL,
	transfusao SMALLINT NULL,
	dt_ult_transfusao DATE NULL,
	codigo_barra_solicitante VARCHAR(45) NULL,
	suspeita_diagnotstico VARCHAR(45) NULL,
	cod_barra_solicitante VARCHAR(45) NULL,
	uso_hidroxiureia SMALLINT NULL,
	uso_medicamentos SMALLINT NULL,
	medicamentos VARCHAR(45) NULL,
	solicitacao_exame VARCHAR(45) NULL,

	CONSTRAINT pk_amostra PRIMARY KEY (idAmostra, idPaciente),
	CONSTRAINT fk_idPaciente FOREIGN KEY (idPaciente) REFERENCES paciente(idPaciente),
	CONSTRAINT fk_idSolicitante FOREIGN KEY (idSolicitante) REFERENCES solicitante(idSolicitante)
);

CREATE TABLE IF NOT EXISTS amostra_contem_exames_aux(
	idExame INT NOT NULL,
	idAmostra INT NOT NULL,
	idPaciente INT NOT NULL,
	valor_resultado_realizado DECIMAL(3,1) NULL, -- provavelmente vai ter que trocar esse valor
	obs_resultado VARCHAR(45) NULL,

	CONSTRAINT pk_amostraExameAux PRIMARY KEY (idExame, idAmostra, idPaciente),
	CONSTRAINT fk_idAmoPac FOREIGN KEY (idAmostra, idPaciente) REFERENCES amostra(idAmostra, idPaciente),
	CONSTRAINT fk_idExame FOREIGN KEY (idExame) REFERENCES exame(idExame)
);

CREATE TABLE IF NOT EXISTS laudo(
 	idLaudo SERIAL,
	qtd_analise_eletroforeticas VARCHAR(45) NULL,
	qtd_analise_citologicas VARCHAR(45) NULL,
	qtd_analise_cromotografica VARCHAR(45) NULL,
	qtd_analise_molecular VARCHAR(45) NULL,
	interpretacao_resultados VARCHAR(750) NULL,
	resultado VARCHAR(450) NULL, -- Preenchido por Edis
	observacao VARCHAR(120) DEFAULT '\"Resultados de exame laboratriais devem ser interpretados sempre em conjunto com os dados clínicosdo paciente.\"',
	dt_liberacao DATE NOT NULL,
	
	CONSTRAINT pk_laudo PRIMARY KEY (idLaudo)
);

CREATE TABLE IF NOT EXISTS pedido(
	idPedido SERIAL,
	idAmostra INT NOT NULL,
	idLaudo INT NOT NULL,
	idPaciente INT NOT NULL,
	valor_resultado_exame DECIMAL(3,1) NULL,
	resultado_texto_bio VARCHAR(45) NULL,
	dt_liberacao DATE NULL,
	info_bio VARCHAR(100) NULL,
	status_pedido VARCHAR(45) NULL,
	
	CONSTRAINT pk_pedido PRIMARY KEY (idPedido),
	CONSTRAINT fk_idAmoPacPedido FOREIGN KEY (idAmostra, idPaciente) REFERENCES amostra (idAmostra, idPaciente),
	CONSTRAINT fk_idLaudo FOREIGN KEY (idLaudo) REFERENCES laudo (idLaudo)
);
	
CREATE TABLE IF NOT EXISTS pedido_tem_exame(
	idPedido INT NOT NULL,
	idAmostra INT NOT NULL,
	idLaudo INT NOT NULL,
	idPaciente INT NOT NULL,
	idExame INT NOT NULL,
	valor_resultado_exame DECIMAL NULL,
	JA_VEM_TABELA_EXAMES_valor_referencia DECIMAL NULL,
	JA_VEM_TABELA_EXAMES_nome_metodo VARCHAR(45) NULL,
	observacao VARCHAR(75) DEFAULT 'Usar apenas para resultado molecular que será feito manualmente',
	status_exame VARCHAR(45) NULL,
	valor_resultado VARCHAR(75) NULL,
	obs_biologo VARCHAR(200) NULL,
	
	CONSTRAINT pk_pedidoExame PRIMARY KEY (idPedido, idExame),
	CONSTRAINT fk_idPedido FOREIGN KEY (idPedido) REFERENCES pedido (idPedido),
	CONSTRAINT fk_idExameP FOREIGN KEY (idExame) REFERENCES exame(idExame)
);

CREATE TABLE IF NOT EXISTS resultados_exame(
	idResultado SERIAL,
	resultado_possivel VARCHAR(75) NOT NULL,
	idade_maior_6m CHAR(1) NULL,
	
	CONSTRAINT pk_resultado PRIMARY KEY (idResultado)
);

CREATE TABLE IF NOT EXISTS exame_tem_resultado(
	idExame INT NOT NULL,
	idResultado INT NOT NULL,
	
	CONSTRAINT pk_exameResult PRIMARY KEY (idExame, idResultado),
	CONSTRAINT fk_idExameR FOREIGN KEY (idExame) REFERENCES exame (idExame),
	CONSTRAINT fk_Result FOREIGN KEY (idResultado) REFERENCES resultados_exame(idResultado)
);