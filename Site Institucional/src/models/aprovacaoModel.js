var database = require("../database/config")

// function cadastrar(nome, email, cnpj,senha,telefone) {
//     var instrucaoSql = `
//         INSERT INTO empresa (nome, cnpj, email,senha,telefone,status) 
//         VALUES ('${nome}', '${cnpj}', '${email}','${senha}','${telefone}',"EM ANÁLISE");
//     `;
//     return database.executar(instrucaoSql);
// }

//Login de Empresa
function verificar() {
  var instrucaoSql = `
    SELECT nome,cnpj,email,telefone,status from empresa
    WHERE status = "EM ANÁLISE";
  `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function verificarAprovados() {
  var instrucaoSql = `
    SELECT nome,cnpj,email,telefone,status from empresa
    WHERE status = "APROVADO";
  `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
    verificar,verificarAprovados
};