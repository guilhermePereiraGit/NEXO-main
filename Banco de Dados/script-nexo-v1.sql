CREATE DATABASE sistema_nexo;
USE sistema_nexo;

-- Tabela do Cliente e dos Associados do Cliente
create table empresa (
idEmpresa int primary key auto_increment,
nome varchar(70),
cnpj varchar(70),
email varchar(70),
senha varchar(30),
telefone varchar(14),
status tinyint,
fkEmpresa int,
foreign key fkEmpresa(fkEmpresa) references empresa(idEmpresa)
) auto_increment = 1;

-- Tabela Destinada ao Login para a Empresa e seus Funcionários
create table usuario (
idUsuario int primary key auto_increment,
nome varchar(80),
cpf varchar(30),
tipo varchar(50),
cargo varchar(50),
telefone varchar(14),
email varchar(70),
senha varchar(45),
fkEmpresa int,
foreign key fkEmpresa(fkEmpresa) references empresa(idEmpresa)
) auto_increment = 1;

-- Usuário Administrativo Nexo para Aprovação de Cadastro
create table usuario_nexo (
idUsuarioNexo int primary key auto_increment,
nome varchar(50),
email varchar(50),
senha varchar(50)
) auto_increment = 1;
insert into usuario_nexo (nome,email,senha) values ("Adminstrador Nexo","adminnexo@gmail.com","12345");

-- Modelo do Totem
create table modelo (
idModelo int primary key auto_increment,
nome varchar(50),
criador varchar(50),
tipo varchar(50),
descricao_arquitetura varchar(100),
status varchar(50),
fkEmpresa int,
foreign key fkEmpresa(fkEmpresa) references empresa(idEmpresa)
) auto_increment = 1;

-- Esta e Parametro estabelecem de forma dinâmica os parâmetros de logs do sistema
create table Tipo_Parametro (
  idTipo_Parametro int primary key auto_increment,
  nome varchar(50)
) auto_increment = 1;

create table Parametro (
  idParametro int primary key auto_increment,
  limite int,
  fkModelo int,
  fkTipoParametro int,
  foreign key fkModelo(fkModelo) references modelo(idModelo),
  foreign key fkTipoParametro(fkTipoParametro) references Tipo_Parametro(idTipo_Parametro)
) auto_increment = 1;

-- Endereço de cada totem e envolve os chamados de atendimento
create table endereco (
idEndereco int primary key auto_increment,
cep varchar(50),
estado varchar(30),
cidade varchar(50),
bairro varchar(50),
logradouro varchar(50),
numero varchar(5),
complemento varchar(50),
telefone varchar(14),
status_modelo tinyint,
fkEmpresa int,
foreign key fkEmpresa(fkEmpresa) references empresa(idEmpresa)
) auto_increment = 1;

-- Dispositivo do qual serão coletadas as informações
create table totem(
idTotem int not null,
numMac varchar(45) not null,
primary key (idTotem, numMac),
instalador varchar(50),
status_totem tinyint,
dataInstalacao datetime,
fkModelo int,
fkEndereco int,
foreign key fkModelo(fkModelo) references modelo(idModelo),
foreign key fkEndereco(fkEndereco) references endereco(idEndereco)
) auto_increment = 1;
