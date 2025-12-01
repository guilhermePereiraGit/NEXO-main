var database = require("../database/config")

function cadastrarTotem(modelo, enderecoMac, fkEndereco) {
    var instrucaoSql = `
        insert into totem (numMAC, status, fkModelo, fkEndereco) 
        values ('${enderecoMac}', 'ATIVO', ${modelo}, ${fkEndereco});
    `
    return database.executar(instrucaoSql);
}

function buscarTotens(idEmpresa) {
    var instrucaoSql = `
            select totem.idTotem as IdTotem, totem.numMAC, modelo.fkEmpresa from totem 
            inner join modelo on modelo.idModelo = totem.fkTotem 
            where modelo.fkEmpresa = ${idEmpresa};
        `
    return database.executar(instrucaoSql);
}

function buscarTotemMac() {
    var instrucaoSql = `totem.fkEndereco from totem inner join endereco on totem.fkEndereco = endereco.idEndereco
    where totem.numMac = ${numMac}`;
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

function ativarTotem(idTotem) {
    var instrucaoSql = `
        UPDATE totem SET status = 'ATIVO' where idTotem = ${idTotem};
    `
    return database.executar(instrucaoSql)
}

function desativarTotem(idTotem) {
    var instrucaoSql = `
        UPDATE totem SET status = 'INATIVO' where idTotem = ${idTotem};
    `
    return database.executar(instrucaoSql)
}

function infoTotem(numMAC){
    var instrucaoSql = `
        SELECT t.idTotem, t.numMAC, t.status, m.nome as modelo, e.cep, e.numero, e.cidade, e.bairro, e.rua
        FROM totem t
        INNER JOIN modelo m ON m.idModelo = t.fkModelo
        INNER JOIN endereco e ON e.idEndereco = t.fkEndereco
        WHERE t.numMAC = '${numMAC}';
    `
    
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrarTotem, verificarAprovados, ativarTotem, desativarTotem, infoTotem
};