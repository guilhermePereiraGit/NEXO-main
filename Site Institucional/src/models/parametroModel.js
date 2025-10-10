var database = require("../database/config")

function buscarTipoParametro() {
  var instrucaoSql = `
    select componente as Componente, statusAprovacao as Status from tipoParametro;
  `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function cadastrarTipoParametro(componente) {
  var instrucaoSql = `
    insert into tipoParametro (componente, statusAprovacao) values ('${componente}', 'EM ANÁLISE');
  `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function cadastrarParametro(limiteMaximo, limiteMinimo, fkTipoParametro){
    var instrucaoSql = `
        insert into parametro (limiteMin, limiteMax, fkTipoParametro) values (${limiteMinimo}, ${limiteMaximo}, ${fkTipoParametro});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarTipoParametro, cadastrarTipoParametro, cadastrarParametro
};