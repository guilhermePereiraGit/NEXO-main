var database = require("../database/config")

function buscarRegioes(emailUsuario) {
    const instrucaoSql = `
    select 
    r.nome as NomeRegiao,
    r.sigla as SiglaRegiao,
    e.nome as NomeEstado
    from areasAtuacao as ar
    inner join regiao as r on r.idRegiao = ar.fkRegiao
    inner join estado as e on r.fkEstado = e.idEstado
    inner join usuario as u on ar.fkUsuario = u.idUsuario
    where u.email = "${emailUsuario}";
    `
    console.log(instrucaoSql)
    return database.executar(instrucaoSql);
}

function buscarModelos() {
    const instrucaoSql = `
    select
    m.idModelo as idModelo,
    m.nome as NomeModelo
    from modelo as m;
    `
    console.log(instrucaoSql)
    return database.executar(instrucaoSql);
}

function buscarTotens(nomeRegiao) {
    const instrucaoSql = `
    select
    t.numMAC
    from totem as t
    inner join endereco as e on e.idEndereco = t.fkEndereco
    inner join regiao as r on r.idRegiao = e.fkRegiao
    where r.nome = "${nomeRegiao}";
    `
    console.log(instrucaoSql)
    return database.executar(instrucaoSql);
}

function buscarComponentes() {
    const instrucaoSql = `
    select nome from componente;
    `
    console.log(instrucaoSql)
    return database.executar(instrucaoSql);
}

function buscarAlertas(regiaoAtual) {
    const instrucaoSql = `
    select 
    c.nome as NomeComponente,
    m.idModelo as idModelo
    from historico_alertas as ha 
    inner join modelo as m on ha.fkModelo = m.idModelo
    inner join componente as c on ha.fkComponente = c.idComponente
    inner join totem as t on t.fkModelo = m.idModelo
    inner join endereco as e on t.fkEndereco = e.idEndereco
    inner join regiao as r on r.idRegiao = e.fkRegiao
    where r.nome = '${regiaoAtual}';
    `
    console.log(instrucaoSql)
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarRegioes,buscarModelos,buscarTotens,buscarComponentes,buscarAlertas
};