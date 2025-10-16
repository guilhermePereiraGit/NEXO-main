var database = require("../database/config")

function cadastrarTotem(vies, modelo, enderecoMac, fkEndereco){
    var instrucaoSql = `
        insert into totem (numMAC, vies, status, fkModelo, fkEndereco) 
        values ('${enderecoMac}', '${vies}', 'ATIVO', ${modelo}, ${fkEndereco});
    `
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrarTotem
};