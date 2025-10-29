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
    nome VARCHAR(100),
    fkEstado INT,
    foreign key fkEstado(fkEstado) references estado(idEstado)
);

-- Zona
CREATE TABLE IF NOT EXISTS zona (
	idZona INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
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

CREATE TABLE IF NOT EXISTS regioesAtuacao (
	fkRegiao INT,
    fkUsuario INT,
    PRIMARY KEY(fkRegiao, fkUsuario),
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

INSERT INTO estado (nome) VALUES
('Acre'),
('Alagoas'),
('Amapá'),
('Amazonas'),
('Bahia'),
('Ceará'),
('Distrito Federal'),
('Espírito Santo'),
('Goiás'),
('Maranhão'),
('Mato Grosso'),
('Mato Grosso do Sul'),
('Minas Gerais'),
('Pará'),
('Paraíba'),
('Paraná'),
('Pernambuco'),
('Piauí'),
('Rio de Janeiro'),
('Rio Grande do Norte'),
('Rio Grande do Sul'),
('Rondônia'),
('Roraima'),
('Santa Catarina'),
('São Paulo'),
('Sergipe'),
('Tocantins');

-- Inserção das Regiões Metropolitanas
INSERT INTO regiao (nome, fkEstado) VALUES
-- Acre
('Região Metropolitana de Rio Branco', 1),

-- Alagoas
('Região Metropolitana de Maceió', 2),

-- Amapá
('Região Metropolitana de Macapá', 3),

-- Amazonas
('Região Metropolitana de Manaus', 4),

-- Bahia
('Região Metropolitana de Salvador', 5),
('Região Metropolitana de Feira de Santana', 5),
('Região Metropolitana de Vitória da Conquista', 5),
('Região Metropolitana do Sul da Bahia (Ilhéus-Itabuna)', 5),

-- Ceará
('Região Metropolitana de Fortaleza', 6),
('Região Metropolitana de Sobral', 6),

-- Distrito Federal
('Região Integrada de Desenvolvimento do Distrito Federal e Entorno (RIDE-DF)', 7),

-- Espírito Santo
('Região Metropolitana da Grande Vitória', 8),

-- Goiás
('Região Metropolitana de Goiânia', 9),

-- Maranhão
('Região Metropolitana do Grande São Luís', 10),

-- Mato Grosso
('Região Metropolitana do Vale do Rio Cuiabá', 11),

-- Mato Grosso do Sul
('Região Metropolitana de Campo Grande', 12),

-- Minas Gerais
('Região Metropolitana de Belo Horizonte', 13),
('Região Metropolitana do Vale do Aço', 13),
('Região Metropolitana de Uberlândia', 13),
('Região Metropolitana de Juiz de Fora', 13),

-- Pará
('Região Metropolitana de Belém', 14),
('Região Metropolitana de Santarém', 14),

-- Paraíba
('Região Metropolitana de João Pessoa', 15),

-- Paraná
('Região Metropolitana de Curitiba', 16),
('Região Metropolitana de Londrina', 16),
('Região Metropolitana de Maringá', 16),

-- Pernambuco
('Região Metropolitana do Recife', 17),
('Região Metropolitana de Caruaru', 17),

-- Piauí
('Região Integrada de Desenvolvimento da Grande Teresina', 18),

-- Rio de Janeiro
('Região Metropolitana do Rio de Janeiro', 19),
('Região Metropolitana do Norte Fluminense', 19),
('Região Metropolitana do Sul Fluminense', 19),

-- Rio Grande do Norte
('Região Metropolitana de Natal', 20),

-- Rio Grande do Sul
('Região Metropolitana de Porto Alegre', 21),
('Região Metropolitana da Serra Gaúcha', 21),
('Região Metropolitana do Litoral Norte', 21),

-- Rondônia
('Região Metropolitana de Porto Velho', 22),

-- Roraima
('Região Metropolitana de Boa Vista', 23),

-- Santa Catarina
('Região Metropolitana da Grande Florianópolis', 24),
('Região Metropolitana do Vale do Itajaí', 24),
('Região Metropolitana do Norte/Nordeste Catarinense', 24),
('Região Metropolitana Carbonífera', 24),
('Região Metropolitana de Chapecó', 24),

-- São Paulo
('Região Metropolitana de São Paulo', 25),
('Região Metropolitana da Baixada Santista', 25),
('Região Metropolitana de Campinas', 25),
('Região Metropolitana de Sorocaba', 25),
('Região Metropolitana do Vale do Paraíba e Litoral Norte', 25),
('Região Metropolitana de Ribeirão Preto', 25),
('Região Metropolitana de São José do Rio Preto', 25),
('Região Metropolitana de Piracicaba', 25),
('Região Metropolitana de Bauru', 25),

-- Sergipe
('Região Metropolitana de Aracaju', 26),

-- Tocantins
('Região Metropolitana de Palmas', 27);

-- São Paulo → Região Metropolitana de São Paulo
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Norte', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de São Paulo';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Sul', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de São Paulo';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Leste', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de São Paulo';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Oeste', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de São Paulo';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Centro', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de São Paulo';

-- Rio de Janeiro → Região Metropolitana do Rio de Janeiro
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Norte', idRegiao FROM regiao WHERE nome = 'Região Metropolitana do Rio de Janeiro';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Sul', idRegiao FROM regiao WHERE nome = 'Região Metropolitana do Rio de Janeiro';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Oeste', idRegiao FROM regiao WHERE nome = 'Região Metropolitana do Rio de Janeiro';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Centro', idRegiao FROM regiao WHERE nome = 'Região Metropolitana do Rio de Janeiro';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Baixada Fluminense', idRegiao FROM regiao WHERE nome = 'Região Metropolitana do Rio de Janeiro';

-- Belo Horizonte
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Sul', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Belo Horizonte';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Norte', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Belo Horizonte';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Leste', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Belo Horizonte';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Oeste', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Belo Horizonte';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Centro-Sul', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Belo Horizonte';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Barreiro', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Belo Horizonte';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Pampulha', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Belo Horizonte';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Venda Nova', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Belo Horizonte';

-- Salvador
INSERT INTO zona (nome, fkRegiao)
SELECT 'Orla Atlântica', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Salvador';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Miolo', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Salvador';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Subúrbio Ferroviário', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Salvador';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Centro Histórico', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Salvador';

-- Recife
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Norte', idRegiao FROM regiao WHERE nome = 'Região Metropolitana do Recife';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Sul', idRegiao FROM regiao WHERE nome = 'Região Metropolitana do Recife';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Centro', idRegiao FROM regiao WHERE nome = 'Região Metropolitana do Recife';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Região Metropolitana Oeste', idRegiao FROM regiao WHERE nome = 'Região Metropolitana do Recife';

-- Fortaleza
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Norte', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Fortaleza';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Sul', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Fortaleza';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Leste', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Fortaleza';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Oeste', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Fortaleza';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Centro', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Fortaleza';

-- Curitiba
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Norte', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Curitiba';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Sul', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Curitiba';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Leste', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Curitiba';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Oeste', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Curitiba';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Centro', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Curitiba';

-- Porto Alegre
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Norte', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Porto Alegre';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Sul', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Porto Alegre';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Leste', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Porto Alegre';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Oeste', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Porto Alegre';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Centro Histórico', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Porto Alegre';

-- Brasília (RIDE-DF)
INSERT INTO zona (nome, fkRegiao)
SELECT 'Plano Piloto', idRegiao FROM regiao WHERE nome = 'Região Integrada de Desenvolvimento do Distrito Federal e Entorno (RIDE-DF)';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Asa Norte', idRegiao FROM regiao WHERE nome = 'Região Integrada de Desenvolvimento do Distrito Federal e Entorno (RIDE-DF)';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Asa Sul', idRegiao FROM regiao WHERE nome = 'Região Integrada de Desenvolvimento do Distrito Federal e Entorno (RIDE-DF)';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Sudoeste/Octogonal', idRegiao FROM regiao WHERE nome = 'Região Integrada de Desenvolvimento do Distrito Federal e Entorno (RIDE-DF)';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Lago Norte', idRegiao FROM regiao WHERE nome = 'Região Integrada de Desenvolvimento do Distrito Federal e Entorno (RIDE-DF)';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Lago Sul', idRegiao FROM regiao WHERE nome = 'Região Integrada de Desenvolvimento do Distrito Federal e Entorno (RIDE-DF)';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Taguatinga', idRegiao FROM regiao WHERE nome = 'Região Integrada de Desenvolvimento do Distrito Federal e Entorno (RIDE-DF)';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Ceilândia', idRegiao FROM regiao WHERE nome = 'Região Integrada de Desenvolvimento do Distrito Federal e Entorno (RIDE-DF)';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Samambaia', idRegiao FROM regiao WHERE nome = 'Região Integrada de Desenvolvimento do Distrito Federal e Entorno (RIDE-DF)';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Gama', idRegiao FROM regiao WHERE nome = 'Região Integrada de Desenvolvimento do Distrito Federal e Entorno (RIDE-DF)';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Guará', idRegiao FROM regiao WHERE nome = 'Região Integrada de Desenvolvimento do Distrito Federal e Entorno (RIDE-DF)';

-- Manaus
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Norte', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Manaus';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Sul', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Manaus';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Leste', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Manaus';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Zona Oeste', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Manaus';
INSERT INTO zona (nome, fkRegiao)
SELECT 'Centro', idRegiao FROM regiao WHERE nome = 'Região Metropolitana de Manaus';

insert into usuario_nexo(nome,email,senha) values ("AdminUserNexo","nexo.sptech@gmail.com","12345");
select * from zona;