var database = require("../database/config");

function buscarDefaults(fkEmpresa) {
    var instrucaoSql = `
        select 
            componente,
            valor_default as valor
        from parametros_default;
    `;
    console.log("buscarDefaults(): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function verificarAprovados(idEmpresa) {
    var instrucaoSql = `
        select 
            idModelo,
            nome,
            descricao_arq,
            status
        from modelo
        where fkEmpresa = ${idEmpresa};
    `;
    console.log("verificarAprovados(): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrarModelo(nomeModelo, descricao, fkEmpresa, parametros) {

    var instrucaoModelo = `
        insert into modelo (nome, descricao_arq, status, fkEmpresa)
        values ('${nomeModelo}', '${descricao}', 'ATIVO', ${fkEmpresa});
    `;
    console.log("cadastrarModelo - INSERT modelo: \n" + instrucaoModelo);

    return database.executar(instrucaoModelo);
}

function inserirParametros(idModelo, valores) {
    var instrucaoSql = `
        insert into parametro (limiteMin, limiteMax, fkModelo, fkComponente)
        values ${valores};
    `;
    console.log("inserirParametros(): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deletarParametros(idModelo) {
    var instrucaoSql = `
        delete from parametro
        where fkModelo = ${idModelo};
    `;
    console.log("deletarParametros(): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarModeloPorId(idModelo) {
    var instrucaoSql = `
        select
            m.idModelo,
            m.nome,
            m.descricao_arq,
            m.status,
            p.idParametro,
            p.limiteMin,
            p.limiteMax,
            c.nome as nomeComponente
        from modelo as m
        left join parametro as p
            on p.fkModelo = m.idModelo
        left join componente as c
            on c.idComponente = p.fkComponente
        where m.idModelo = ${idModelo};
    `;
    console.log("buscarModeloPorId(): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizarModelo(idModelo, nomeModelo, descricao) {
    var instrucaoSql = `
        update modelo
        set nome = '${nomeModelo}',
            descricao_arq = '${descricao}'
        where idModelo = ${idModelo};
    `;
    console.log("atualizarModelo(): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = { buscarDefaults, verificarAprovados, cadastrarModelo, inserirParametros, deletarParametros, buscarModeloPorId, atualizarModelo
};
