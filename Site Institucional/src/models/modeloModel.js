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
        SELECT idComponente FROM componente ORDER BY idComponente DESC LIMIT 1;
    `;
    return database.executar(instrucaoSql);
}

function buscarSeTipoParametroJaExiste(componente) {
    var instrucaoSql = `
        SELECT idComponente FROM componente where nome = '${componente}';
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

function cadastrarValoresParametro(idModelo, nomeParametro, limiteMin, limiteMax){
    var instrucaoSql = `
        INSERT INTO parametro (limiteMin, limiteMax, fkModelo, fkComponente) 
            VALUES (${limiteMin}, ${limiteMax}, ${idModelo}, (SELECT idComponente FROM componente WHERE nome = '${nomeParametro}'));
    `
    return database.executar(instrucaoSql);
}

function atualizarParametro(idModelo, nomeParametro, limiteMin, limiteMax) {
    var instrucaoSql = `
        UPDATE parametro set limiteMin = ${limiteMin}, limiteMax = ${limiteMax}
            where fkModelo = ${idModelo} and fkComponente = (select idComponente from componente where nome = '${nomeParametro}');
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrarModelo, cadastrarTipoParametro, cadastrarParametro, buscarIdTipoParametro, buscarIdModelo,
    buscarSeTipoParametroJaExiste, buscarTipoParametro, buscarModelos, verificarAprovados,
    buscarModelosCadastrados, buscarParametro, atualizarParametro, cadastrarValoresParametro
};
