var database = require("../database/config")

function guardar(idRegiao) {
  var instrucaoSql = `
    SELECT 
    zona.idZona,
    zona.nome as nomeZona,
    regiao.idRegiao,
    regiao.nome as nomeRegiao
    FROM zona
    INNER JOIN regiao ON regiao.idRegiao = zona.fkRegiao
    WHERE regiao.idRegiao = ${idRegiao};
  `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function alterar(alterar_itens) {
  console.log("PEEENIS",alterar_itens);
  
  var instrucaoSql = `
    UPDATE areasAtuacao SET
    fkZona = ${alterar_itens.novaZona}
    WHERE fkUsuario = ${alterar_itens.idUsuario} AND
    fkRegiao = ${alterar_itens.idRegiao};
  `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  guardar,alterar
};