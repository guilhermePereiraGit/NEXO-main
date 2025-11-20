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

module.exports = {
    buscarRegioes,buscarModelos,buscarTotens
};