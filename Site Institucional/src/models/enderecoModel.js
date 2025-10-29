var database = require("../database/config")

function cadastrarEnderecoSemRegiao(cep, estado, bairro, cidade, rua, numero, complemento) {
    const instrucaoSql = `
        INSERT INTO endereco (cep, estado, bairro, cidade, rua, numero, complemento)
        VALUES ('${cep}', '${estado}', '${bairro}', '${cidade}', '${rua}', '${numero}', '${complemento}');
    `;
    return database.executar(instrucaoSql);
}

function cadastrarEnderecoComRegiao(cep, estado, bairro, cidade, rua, numero, complemento, zona) {
    const instrucaoSql = `
        INSERT INTO endereco (cep, estado, bairro, cidade, rua, numero, complemento, zona)
        VALUES ('${cep}', '${estado}', '${bairro}', '${cidade}', '${rua}', '${numero}', '${complemento}', '${zona}');
    `;
    return database.executar(instrucaoSql);
}

function buscarEnderecoExistente(cidade, rua, numero, complemento) {
    const instrucaoSql = `
        SELECT idEndereco from endereco where cidade = '${cidade}' and rua = '${rua}' and numero = '${numero}' and complemento = '${complemento}';
    `
    return database.executar(instrucaoSql);
}

function buscarIdEstado(estadoAtuacao) {
    const instrucaoSql = `
        SELECT idEstado from estado where nome = '${estadoAtuacao}';
    `
    return database.executar(instrucaoSql);
}

function buscarIdRegiao(regiaoAtuacao) {
    const instrucaoSql = `
        SELECT idRegiao from regiao where nome = '${regiaoAtuacao}';
    `
    return database.executar(instrucaoSql);
}

function buscarIdZona(zonaAtuacao) {
    const instrucaoSql = `
        SELECT idZona from zona where nome = '${zonaAtuacao}';
    `
    return database.executar(instrucaoSql);
}

function cadastrarUsuarioComZona(retornoIdZona, retornoIdUsuario, retornoIdRegiao){
    const instrucaoSql = `
        INSERT INTO areasAtuacao (fkRegiao, fkUsuario, fkZona) values (${retornoIdRegiao}, ${retornoIdUsuario}, ${retornoIdZona}]);
    `
    return database.executar(instrucaoSql);
}

function cadastrarUsuarioComRegiao(retornoIdUsuario, retornoIdRegiao){
    const instrucaoSql = `
        INSERT INTO regioesAtuacao (fkRegiao, fkUsuario) values (${retornoIdRegiao}, ${retornoIdUsuario});
    `
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrarEnderecoSemRegiao, buscarEnderecoExistente, cadastrarEnderecoComRegiao, buscarIdEstado,
    buscarIdRegiao, buscarIdZona, cadastrarUsuarioComZona, cadastrarUsuarioComRegiao
};