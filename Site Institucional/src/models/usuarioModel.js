var database = require("../database/config")

function cadastrar(nome, email, cnpj, senha, telefone) {
  var instrucaoSql = `
        INSERT INTO empresa (nome, cnpj, email,senha,telefone,status) 
        VALUES ('${nome}', '${cnpj}', '${email}','${senha}','${telefone}',"EM ANÁLISE");
    `;
  return database.executar(instrucaoSql);
}

async function cadastrarUsuario(nome, email, cpf, senha, telefone, cargo, fkEmpresa) {
  var instrucaoSql = `
        INSERT INTO usuario (nome, cpf, cargo, email, senha, telefone, fkEmpresa) 
        VALUES ('${nome}', '${cpf}', '${cargo}','${email}','${senha}','${telefone}', '${fkEmpresa}');`;
  const resultado = await database.executar(instrucaoSql);
  return resultado.insertId;
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
    SELECT 
        u.idUsuario,
        u.nome,
        u.email,
        u.senha,
        u.cargo,
        u.telefone,
        COALESCE(z.nome, NULL) AS NomeZona,
        COALESCE(r1.nome, r2.nome) AS NomeRegiao,
        COALESCE(e1.nome, e2.nome) AS NomeEstado
    FROM usuario u
    -- 🔹 Caso o usuário esteja em uma área (com ou sem zona)
    LEFT JOIN areasAtuacao a ON a.fkUsuario = u.idUsuario
    LEFT JOIN zona z ON a.fkZona = z.idZona
    LEFT JOIN regiao r1 ON COALESCE(z.fkRegiao, a.fkRegiao) = r1.idRegiao
    LEFT JOIN estado e1 ON r1.fkEstado = e1.idEstado
    -- 🔹 Caso o usuário esteja apenas em uma região (sem zona)
    LEFT JOIN regioesAtuacao ra ON ra.fkUsuario = u.idUsuario
    LEFT JOIN regiao r2 ON ra.fkRegiao = r2.idRegiao
    LEFT JOIN estado e2 ON r2.fkEstado = e2.idEstado
    WHERE u.fkEmpresa = ${idEmpresa};

  `;
  return database.executar(instrucaoSql);
}


module.exports = {
  cadastrar, autenticarEmpresa, autenticarAdm, autenticarUsuario, verificarUsuarios, deletarFuncionario,
  cadastrarUsuario, limparFuncionarios, deletarEmpresa, verificarAprovados
};