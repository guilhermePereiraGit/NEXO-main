var database = require("../database/config")

function cadastrarModelo(nomeModelo, descricao, fkEmpresa) {
    var instrucaoSql = `
        INSERT INTO modelo (nome, descricao_arq, fkEmpresa, status) 
        VALUES ('${nomeModelo}', '${descricao}', '${fkEmpresa}', 'ATIVO');`;
    return database.executar(instrucaoSql);
}

function cadastrarTipoParametro(componente) {
    var instrucaoSql = `
        INSERT INTO tipoParametro (componente, status) 
        VALUES ('${componente}', 'ATIVO');`;
    return database.executar(instrucaoSql);
}

function cadastrarParametro(fkModelo, fkTipoParametro) {
    var instrucaoSql = `
        INSERT INTO parametro (fkModelo, fkTipoParametro) 
        VALUES (${fkModelo}, ${fkTipoParametro});`;
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

function buscarSeTipoParametroJaExiste(componente) {
    var instrucaoSql = `
        SELECT idTipoParametro FROM tipoParametro where componente = '${componente}';
    `
    return database.executar(instrucaoSql);
}

function buscarTipoParametro(fkEmpresa) {
    var instrucaoSql = `
        select distinct componente from tipoParametro tp
        inner join parametro p on tp.idTipoParametro = p.fkTipoParametro
        inner join modelo m on p.fkModelo = m.idModelo
        where m.fkEmpresa = ${fkEmpresa};
    `
    return database.executar(instrucaoSql);
}

function buscarModelos(fkEmpresa) {
    var instrucaoSql = `
        select idModelo as IdModelo, nome Nome from modelo where fkEmpresa = ${fkEmpresa};
    `
    return database.executar(instrucaoSql);
}

function verificarAprovados() {
    var instrucaoSql = `
    SELECT idModelo, nome, descricao_arq, status from modelo;
  `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarModelosCadastrados(){
    var instrucaoSql = `
    SELECT e.nome NomeEmpresa, m.nome NomeModelo, m.descricao_arq DescricaoModelo, idModelo IdModelo from empresa e inner join modelo m on m.fkEmpresa = e.idEmpresa;
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrarModelo, cadastrarTipoParametro, cadastrarParametro, buscarIdTipoParametro, buscarIdModelo,
    buscarSeTipoParametroJaExiste, buscarTipoParametro, buscarModelos, verificarAprovados,
    buscarModelosCadastrados
};
