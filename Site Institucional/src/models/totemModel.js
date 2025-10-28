var database = require("../database/config")

function cadastrarTotem(modelo, enderecoMac, fkEndereco){
    var instrucaoSql = `
        insert into totem (numMAC, status, fkModelo, fkEndereco) 
        values ('${enderecoMac}', 'ATIVO', ${modelo}, ${fkEndereco});
    `
    return database.executar(instrucaoSql);
}

function verificarAprovados(idEmpresa) {
    var instrucaoSql = `
    SELECT idTotem, t.numMAC, t.status, m.nome from totem t 
    inner join modelo m on t.fkModelo = m.idModelo
    inner join empresa e on m.fkEmpresa = e.idEmpresa
    where e.idEmpresa = ${idEmpresa};
  `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function ativarTotem(idTotem){
    var instrucaoSql = `
        UPDATE totem SET status = 'ATIVO' where idTotem = ${idTotem};
    `
    return database.executar(instrucaoSql)
}

function desativarTotem(idTotem){
    var instrucaoSql = `
        UPDATE totem SET status = 'INATIVO' where idTotem = ${idTotem};
    `
    return database.executar(instrucaoSql)
}

module.exports = {
    cadastrarTotem, verificarAprovados, ativarTotem, desativarTotem
};