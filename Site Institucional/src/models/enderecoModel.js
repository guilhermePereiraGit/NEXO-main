var database = require("../database/config")

function cadastrarEndereco(cep, estado, bairro, cidade, rua, numero, complemento) {
    const instrucaoSql = `
        INSERT INTO endereco (cep, estado, bairro, cidade, rua, numero, complemento)
        VALUES ('${cep}', '${estado}', '${bairro}', '${cidade}', '${rua}', '${numero}', '${complemento}');
    `;
    return database.executar(instrucaoSql);
}


module.exports = {
    cadastrarEndereco
};