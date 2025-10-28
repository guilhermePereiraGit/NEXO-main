var database = require("../database/config")

function cadastrar(nome, email, cnpj, senha, telefone) {
  var instrucaoSql = `
        INSERT INTO empresa (nome, cnpj, email,senha,telefone,status) 
        VALUES ('${nome}', '${cnpj}', '${email}','${senha}','${telefone}',"EM ANÁLISE");
    `;
  return database.executar(instrucaoSql);
}

function cadastrarFuncionarioSemRegiao(nome, email, cpf, senha, telefone, cargo, estadoAtuacao, fkEmpresa) {
  var instrucaoSql = `
        INSERT INTO usuario (nome, cpf, cargo, email, senha, telefone, estadoAtuacao, fkEmpresa) 
        VALUES ('${nome}', '${cpf}', '${cargo}','${email}','${senha}','${telefone}', '${estadoAtuacao}', '${fkEmpresa}');`;
  return database.executar(instrucaoSql);
}

function cadastrarFuncionarioComRegiao(nome, email, cpf, senha, telefone, cargo, regiaoAtuacao, estadoAtuacao, fkEmpresa) {
  var instrucaoSql = `
        INSERT INTO usuario (nome, cpf, cargo, email, senha, telefone, estadoAtuacao, regiaoAtuacao, fkEmpresa) 
        VALUES ('${nome}', '${cpf}', '${cargo}','${email}','${senha}','${telefone}', '${estadoAtuacao}', '${regiaoAtuacao}', '${fkEmpresa}');`;
  return database.executar(instrucaoSql);
}

function deletarFuncionario(idUsuario) {
  var instrucaoSql = `
        DELETE FROM usuario WHERE idUsuario = ${idUsuario};`
  return database.executar(instrucaoSql);
}

//Login de Empresa
function autenticarEmpresa(email, senha) {
  console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
  var instrucaoSql = `
    SELECT idEmpresa,nome,cnpj,email,senha,telefone,status 
    FROM empresa WHERE email = '${email}' AND senha = '${senha}';
  `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

//Login de Funcionário
function autenticarUsuario(email, senha) {
  var instrucaoSql = `
    SELECT idUsuario,nome,cpf,email,senha,telefone,cargo,fkEmpresa
    FROM usuario WHERE email = '${email}' AND senha = '${senha}';
  `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

//Login adminstrativo Usuário NEXO
function autenticarAdm(email, senha) {
  console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
  var instrucaoSql = `
    SELECT idUsuarioNexo,nome,email,senha 
    FROM usuario_nexo WHERE email = '${email}' AND senha = '${senha}';
  `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function verificarUsuarios(idEmpresa) {
  var instrucaoSql = `
    SELECT idUsuario,nome,cpf,cargo,email,telefone,senha,fkEmpresa from usuario
    WHERE fkEmpresa = ${idEmpresa};
  `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// Função para remover Empresa
function limparFuncionarios(fkEmpresa) {
  var instrucaoSql = `
        DELETE FROM usuario WHERE fkEmpresa = ${fkEmpresa}`;
  return database.executar(instrucaoSql);
}

function deletarEmpresa(idEmpresa) {
  var instrucaoSql = `
        DELETE FROM empresa WHERE idEmpresa = ${idEmpresa}`;
  return database.executar(instrucaoSql);
}

function verificarAprovados(idEmpresa) {
  var instrucaoSql = `
    SELECT idUsuario,nome,email,telefone,cargo,regiaoAtuacao from usuario WHERE fkEmpresa = ${idEmpresa};
  `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  cadastrar, autenticarEmpresa, autenticarAdm, autenticarUsuario, verificarUsuarios, cadastrarFuncionarioSemRegiao, deletarFuncionario,
  cadastrarFuncionarioComRegiao, limparFuncionarios, deletarEmpresa, verificarAprovados
};