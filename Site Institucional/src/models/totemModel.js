var database = require("../database/config")

function cadastrarTotem(vies, modelo, enderecoMac, fkEndereco){
    var instrucaoSql = `
        insert into totem (numMAC, vies, status, fkModelo, fkEndereco) 
        values ('${enderecoMac}', '${vies}', 'ATIVO', ${modelo}, ${fkEndereco});
    `
    return database.executar(instrucaoSql);
}

function verificarAprovados() {
    var instrucaoSql = `
    SELECT t.numMAC, t.vies, t.status, m.nome from totem t inner join modelo m on t.fkModelo = m.idModelo;
  `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrarTotem, verificarAprovados
};