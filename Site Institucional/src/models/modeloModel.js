var database = require("../database/config")

function cadastrarModelo(nomeModelo, descricao, fkEmpresa) {
    var instrucaoSql = `
        INSERT INTO modelo (nome, descricao_arq, fkEmpresa, status) 
        VALUES ('${nomeModelo}', '${descricao}', '${fkEmpresa}', 'ATIVO');`;
    return database.executar(instrucaoSql); 
}

function cadastrarTipoParametro(componente) {
    var instrucaoSql = `
        INSERT INTO componente (nome, status) 
        VALUES ('${componente.toUpperCase()}', 'ATIVO');`;
    return database.executar(instrucaoSql);
}

function buscarIdTipoParametro() {
    var instrucaoSql = `
        SELECT idComponente FROM componente ORDER BY idComponente DESC LIMIT 1;
    `;
    return database.executar(instrucaoSql);
}

function buscarSeTipoParametroJaExiste(componente) {
    var instrucaoSql = `
        SELECT idComponente FROM componente where nome = '${componente.toUpperCase()}';
    `
    return database.executar(instrucaoSql);
}

function buscarTipoParametro(fkEmpresa) {
    var instrucaoSql = `
        select distinct tp.nome from componente tp
        inner join parametro p on tp.idComponente = p.fkComponente
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

function verificarAprovados(idEmpresa) {
    var instrucaoSql = `
    SELECT idModelo, nome, descricao_arq, status from modelo where fkEmpresa = ${idEmpresa};
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
            GROUP_CONCAT(tp.nome SEPARATOR ', ') AS TiposParametro
        FROM empresa e
        INNER JOIN modelo m 
            ON m.fkEmpresa = e.idEmpresa
        LEFT JOIN parametro p 
            ON p.fkModelo = m.idModelo
        LEFT JOIN componente tp 
            ON tp.idComponente = p.fkComponente
        WHERE e.idEmpresa = ${idEmpresa}
        GROUP BY m.idModelo;
    `;
    return database.executar(instrucaoSql);
}

function cadastrarParametro(idModelo, fkTipoParametro){
        var instrucaoSql = `
        INSERT INTO parametro (fkModelo, fkComponente) VALUES (${idModelo}, ${fkTipoParametro});
    `;
    return database.executar(instrucaoSql);
}

function buscarParametro(idModelo){
    var instrucaoSql = `
        SELECT limiteMin, limiteMax from parametro where fkModelo = ${idModelo};
    `
    return database.executar(instrucaoSql);
}

function buscarDefaults() {
    var instrucaoSql = `
        SELECT componente, valor_default as valor FROM parametros_default;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
function buscarInfoModelo(idModelo) {
    var instrucaoSql = `
        SELECT nome, descricao_arq FROM modelo WHERE idModelo = ${idModelo};
    `;
    return database.executar(instrucaoSql);
}

function buscarParametrosDoModelo(idModelo) {
    var instrucaoSql = `
        SELECT c.nome, p.limiteMin, p.limiteMax 
        FROM parametro p
        JOIN componente c ON p.fkComponente = c.idComponente
        WHERE p.fkModelo = ${idModelo};
    `;
    return database.executar(instrucaoSql);
}

function atualizarInfoModelo(idModelo, nome, descricao) {
    var instrucaoSql = `
        UPDATE modelo SET nome = '${nome}', descricao_arq = '${descricao}'
        WHERE idModelo = ${idModelo};
    `;
    return database.executar(instrucaoSql);
}

function deletarParametrosDoModelo(idModelo) {
    var instrucaoSql = `
        DELETE FROM parametro WHERE fkModelo = ${idModelo};
    `;
    return database.executar(instrucaoSql);
}

function cadastrarValoresParametro(idModelo, nomeParametro, limiteMin, limiteMax){
    var nomeParametroUpper = nomeParametro.toUpperCase();

    var instrucaoSql = `
        INSERT INTO parametro (limiteMin, limiteMax, fkModelo, fkComponente) 
            VALUES (${limiteMin}, ${limiteMax}, ${idModelo}, (SELECT idComponente FROM componente WHERE nome = '${nomeParametroUpper}'));
    `
    return database.executar(instrucaoSql);
}

function atualizarParametro(idModelo, nomeParametro, limiteMin, limiteMax) {
    var nomeParametroUpper = nomeParametro.toUpperCase();

    var instrucaoSql = `
        UPDATE parametro set limiteMin = ${limiteMin}, limiteMax = ${limiteMax}
            where fkModelo = ${idModelo} and fkComponente = (select idComponente from componente where nome = '${nomeParametroUpper}');
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrarModelo, cadastrarTipoParametro, cadastrarParametro, buscarIdTipoParametro,
    buscarSeTipoParametroJaExiste, buscarTipoParametro, buscarModelos, verificarAprovados,
    buscarModelosCadastrados, buscarParametro, atualizarParametro, cadastrarValoresParametro, buscarDefaults, buscarInfoModelo,buscarParametrosDoModelo, atualizarInfoModelo, deletarParametrosDoModelo
};