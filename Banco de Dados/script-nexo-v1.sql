CREATE DATABASE IF NOT EXISTS NEXO_DB;
USE NEXO_DB;

CREATE TABLE IF NOT EXISTS empresa (
	idEmpresa INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(80),
    cnpj VARCHAR(18),
    email VARCHAR(70),
    senha VARCHAR(30),
    telefone VARCHAR(14),
    status VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS usuario (
	idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(80),
    cpf VARCHAR(14),
    cargo VARCHAR(45),
    email VARCHAR(70),
    senha VARCHAR(30),
    telefone VARCHAR(14),
    regiaoAtuacao varchar(45),
    fkEmpresa INT,
    foreign key fk_empresa_usuario2 (fkEmpresa) references empresa(idEmpresa)
);

CREATE TABLE IF NOT EXISTS modelo (
	idModelo INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(80),
    criador VARCHAR(80),
    tipo VARCHAR(45),
    descricao_arq VARCHAR(100),
    status VARCHAR(30),
    fkEmpresa INT,
    foreign key fk_empresa_funcionario (fkEmpresa) references empresa(idEmpresa),
    constraint status_modelo_check check(status in ("ATIVO", "INATIVO"))
);

CREATE TABLE IF NOT EXISTS parametro (
	idParametro INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    limiteMin DECIMAL(4,2),
    limiteMax DECIMAL(4,2),
    fkModelo INT,
    foreign key fk_modelo_parametro (fkModelo) references modelo(idModelo)
);

CREATE TABLE IF NOT EXISTS tipoParametro (
	idTipoParametro INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(45),
    fkParametro INT,
    foreign key fk_parametro_tipoParametro (fkParametro) references parametro(idParametro)
);

CREATE TABLE IF NOT EXISTS endereco (
	idEndereco INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    cep VARCHAR(9),
    numero INT,
    complemento VARCHAR(45),
    fkEmpresa INT,
    foreign key fk_empresa_endereco (fkEmpresa) references empresa(idEmpresa)
);

CREATE TABLE IF NOT EXISTS totem (
	idTotem INT NOT NULL AUTO_INCREMENT,
    numMAC VARCHAR(17) NOT NULL,
    criador VARCHAR(80),
    status VARCHAR(30),
    dataInstalacao DATETIME,
    fkModelo INT,
    fkEndereco INT,
    primary key (idTotem, numMAC),
    foreign key fk_modelo_totem (fkModelo) references modelo(idModelo),
    foreign key fk_endereco_totem (fkEndereco) references endereco(idEndereco),
    constraint status_totem_check check(status in ("ATIVO", "INATIVO"))
);

CREATE TABLE IF NOT EXISTS usuario_nexo (
	idUsuarioNexo INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(80),
    email VARCHAR(70),
    senha VARCHAR(30)
);

insert into usuario_nexo (nome, email, senha) values ('Gabriel', 'gabriel@gmail.com', '12345');