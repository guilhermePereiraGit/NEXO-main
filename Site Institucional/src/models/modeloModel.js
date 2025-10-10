var database = require("../database/config")

function buscarModelo(nome, email,fkEmpresa) {
    var instrucaoSql = `
        DELETE FROM usuario WHERE nome = '${nome}' AND email = '${email}' AND fkEmpresa = ${fkEmpresa}`;
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarModelos
};