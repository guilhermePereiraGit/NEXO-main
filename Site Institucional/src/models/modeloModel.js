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

function buscarModelosCadastrados(idEmpresa) {
    var instrucaoSql = `
        SELECT 
            e.nome AS NomeEmpresa,
            m.idModelo AS IdModelo,
            m.nome AS NomeModelo,
            m.descricao_arq AS DescricaoModelo,
            GROUP_CONCAT(tp.componente SEPARATOR ', ') AS TiposParametro
        FROM empresa e
        INNER JOIN modelo m 
            ON m.fkEmpresa = e.idEmpresa
        LEFT JOIN parametro p 
            ON p.fkModelo = m.idModelo
        LEFT JOIN tipoParametro tp 
            ON tp.idTipoParametro = p.fkTipoParametro
        WHERE e.idEmpresa = ${idEmpresa}
        GROUP BY m.idModelo;
    `;
    return database.executar(instrucaoSql);
}

function cadastrarParametro(idModelo, fkTipoParametro){
        var instrucaoSql = `
        INSERT INTO parametro (fkModelo, fkTipoParametro) VALUES (${idModelo}, ${fkTipoParametro});
    `;
    return database.executar(instrucaoSql);
}

function buscarParametro(idModelo){
    var instrucaoSql = `
        SELECT limiteMin, limiteMax from parametro where fkModelo = ${idModelo};
    `
    return database.executar(instrucaoSql);
}

function cadastrarValoresParametro(idModelo, nomeParametro, limiteMin, limiteMax){
    var instrucaoSql = `
        INSERT INTO parametro (limiteMin, limiteMax, fkModelo, fkTipoParametro) 
            VALUES (${limiteMin}, ${limiteMax}, ${idModelo}, (SELECT idTipoParametro FROM tipoParametro WHERE componente = '${nomeParametro}'));
    `
    return database.executar(instrucaoSql);
}

function atualizarParametro(idModelo, nomeParametro, limiteMin, limiteMax) {
    var instrucaoSql = `
        UPDATE parametro set limiteMin = ${limiteMin}, limiteMax = ${limiteMax}
            where fkModelo = ${idModelo} and fkTipoParametro = (select idTipoParametro from tipoParametro where componente = '${nomeParametro}');
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrarModelo, cadastrarTipoParametro, cadastrarParametro, buscarIdTipoParametro, buscarIdModelo,
    buscarSeTipoParametroJaExiste, buscarTipoParametro, buscarModelos, verificarAprovados,
    buscarModelosCadastrados, buscarParametro, atualizarParametro, cadastrarValoresParametro
};
