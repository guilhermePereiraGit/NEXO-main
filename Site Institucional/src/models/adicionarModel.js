var database = require("../database/config")
function cadastrarEndZona(retornoIdZona, retornoIdUsuario, retornoIdRegiao) {
    const instrucaoSql = `
        INSERT INTO areasAtuacao (fkRegiao, fkUsuario, fkZona) values (${retornoIdRegiao}, ${retornoIdUsuario}, ${retornoIdZona});
    `
    return database.executar(instrucaoSql);
}

function cadastrarEndGestor(retornoIdUsuario, retornoIdRegiao) {
    const instrucaoSql = `
        INSERT INTO regioesAtuacao (fkRegiao, fkUsuario) values (${retornoIdRegiao}, ${retornoIdUsuario});
    `
    return database.executar(instrucaoSql);
} 

module.exports = {
    cadastrarEndGestor,cadastrarEndZona
};