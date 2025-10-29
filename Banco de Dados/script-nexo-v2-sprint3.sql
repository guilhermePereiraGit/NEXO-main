CREATE DATABASE IF NOT EXISTS NEXO_DB;
USE NEXO_DB;

-- Empresa
CREATE TABLE IF NOT EXISTS empresa (
	idEmpresa INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(80),
    cnpj VARCHAR(18),
    email VARCHAR(70),
    senha VARCHAR(30),
    telefone VARCHAR(14),
    status VARCHAR(30)
);

-- Usuário Técnico/Gestor/Empresa
CREATE TABLE IF NOT EXISTS usuario (
	idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(80),
    cpf VARCHAR(14),
    cargo VARCHAR(45),
    email VARCHAR(70),
    senha VARCHAR(30),
    telefone VARCHAR(14),
    fkEmpresa INT,
    foreign key fk_empresa_usuario2 (fkEmpresa) references empresa(idEmpresa)
);

-- Estado
CREATE TABLE IF NOT EXISTS estado (
	idEstado INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50)
);

-- Região
CREATE TABLE IF NOT EXISTS regiao (
	idRegiao INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50),
    fkEstado INT,
    foreign key fkEstado(fkEstado) references estado(idEstado)
);

-- Zona
CREATE TABLE IF NOT EXISTS zona (
	idZona INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50),
    fkRegiao INT,
    foreign key fkRegiao(fkRegiao) references regiao(idRegiao)
);

CREATE TABLE IF NOT EXISTS areasAtuacao (
	fkRegiao INT,
    fkUsuario INT,
    PRIMARY KEY(fkRegiao, fkUsuario),
    fkZona INT,
    foreign key fkZona(fkZona) references zona(idZona),
    foreign key fkRegiao(fkRegiao) references regiao(idRegiao),
    foreign key fkUsuario(fkUsuario) references usuario(idUsuario)
);

-- Modelo
CREATE TABLE IF NOT EXISTS modelo (
	idModelo INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(80),
    descricao_arq VARCHAR(100),
    status VARCHAR(30),
    fkEmpresa INT,
    foreign key fk_empresa_funcionario (fkEmpresa) references empresa(idEmpresa),
    constraint status_modelo_check check(status in ("ATIVO", "INATIVO"))
);

-- Tipo Parâmetro
CREATE TABLE IF NOT EXISTS componente (
	idComponente INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	nome varchar(45),
    status varchar(45)
);

-- Parâmetro
CREATE TABLE IF NOT EXISTS parametro (
	idParametro INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    limiteMin varchar(45),
    limiteMax varchar(45),
    fkModelo INT,
    fkComponente INT,
    foreign key fk_modelo_parametro (fkModelo) references modelo(idModelo),
    foreign key fk_componente_parametro (fkComponente) references componente(idComponente)
);

-- Endereço
CREATE TABLE IF NOT EXISTS endereco (
	idEndereco INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    cep VARCHAR(8),
    numero VARCHAR(10),
    complemento VARCHAR(100),
    estado VARCHAR(45),
    cidade VARCHAR(45),
    bairro VARCHAR(100),
	rua VARCHAR(100),
    fkRegiao int,
    foreign key fkRegiao(fkRegiao) references regiao(idRegiao),
    fkZona int,
    foreign key fkZona(fkZona) references zona(idZona)
);

-- Totem
CREATE TABLE IF NOT EXISTS totem (
	idTotem INT NOT NULL AUTO_INCREMENT,
    numMAC VARCHAR(17) NOT NULL,
    status VARCHAR(30),
    fkModelo INT,
    fkEndereco INT,
    primary key (idTotem, numMAC),
    foreign key fk_modelo_totem (fkModelo) references modelo(idModelo),
    foreign key fk_endereco_totem (fkEndereco) references endereco(idEndereco),
    constraint status_totem_check check(status in ("ATIVO", "INATIVO"))
);

-- Usuário NEXO
CREATE TABLE IF NOT EXISTS usuario_nexo (
	idUsuarioNexo INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(80),
    email VARCHAR(70),
    senha VARCHAR(30)
);
insert into usuario_nexo(nome,email,senha) values ("AdminUserNexo","nexo.sptech@gmail.com","12345");