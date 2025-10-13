var database = require("../database/config")

function cadastrarModelo(nomeModelo, descricao, fkEmpresa) {
    var instrucaoSql = `
        INSERT INTO modelo (nome, descricao_arq, fkEmpresa, status) 
        VALUES ('${nomeModelo}', '${descricao}', '${fkEmpresa}', 'INATIVO');`;
    return database.executar(instrucaoSql);
}

function cadastrarTipoParametro(componente) {
    var instrucaoSql = `
        INSERT INTO tipoParametro (componente, status) 
        VALUES ('${componente}', 'INATIVO');`;
    return database.executar(instrucaoSql);
}

function cadastrarParametro(limiteMaximo, limiteMinimo, fkModelo, fkTipoParametro) {
    var instrucaoSql = `
        INSERT INTO parametro (limiteMax, limiteMin, fkModelo, fkTipoParametro) 
        VALUES ('${limiteMaximo}', '${limiteMinimo}', ${fkModelo}, ${fkTipoParametro});`;
    return database.executar(instrucaoSql);
}

function buscarIdModelo() {
    var instrucaoSql = `
        SELECT idModelo FROM modelo ORDER BY idModelo DESC LIMIT 1;
    `;
    return database.executar(instrucaoSql);
}

function buscarIdTipoParametro() {
    var instrucaoSql = `
        SELECT idTipoParametro FROM tipoParametro ORDER BY idTipoParametro DESC LIMIT 1;
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrarModelo, cadastrarTipoParametro, cadastrarParametro, buscarIdTipoParametro, buscarIdModelo
};