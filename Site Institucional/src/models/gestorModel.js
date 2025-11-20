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

module.exports = {
    buscarRegioes
};