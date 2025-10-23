var database = require("../database/config")

function cadastrarEnderecoSemRegiao(cep, estado, bairro, cidade, rua, numero, complemento) {
    const instrucaoSql = `
        INSERT INTO endereco (cep, estado, bairro, cidade, rua, numero, complemento)
        VALUES ('${cep}', '${estado}', '${bairro}', '${cidade}', '${rua}', '${numero}', '${complemento}');
    `;
    return database.executar(instrucaoSql);
}

function cadastrarEnderecoComRegiao(cep, estado, bairro, cidade, rua, numero, complemento, zona){
    const instrucaoSql = `
        INSERT INTO endereco (cep, estado, bairro, cidade, rua, numero, complemento, zona)
        VALUES ('${cep}', '${estado}', '${bairro}', '${cidade}', '${rua}', '${numero}', '${complemento}', '${zona}');
    `;
    return database.executar(instrucaoSql);
}

function buscarEnderecoExistente(cidade, rua, numero, complemento){
    const instrucaoSql = `
        SELECT idEndereco from endereco where cidade = '${cidade}' and rua = '${rua}' and numero = '${numero}' and complemento = '${complemento}';
    `
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrarEnderecoSemRegiao, buscarEnderecoExistente, cadastrarEnderecoComRegiao
};