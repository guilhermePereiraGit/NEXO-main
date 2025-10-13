var modeloModel = require("../models/modeloModel");

async function cadastrarModelo(req, res) {
    console.log('Entrou na função cadastrarModelo do controller');

    var nomeModelo = req.body.nomeModeloServer;
    var descricao = req.body.descricaoServer;
    var parametros = req.body.parametrosServer;
    var fkEmpresa = req.body.fkEmpresaServer;
    var fkTipoParametro = [];
    var fkModelo = 0;

    if (!nomeModelo) {
        return res.status(400).send("Nome do modelo está undefined!");
    } else if (!descricao) {
        return res.status(400).send("Descrição está undefined!");
    } else if (!parametros || parametros.length === 0) {
        return res.status(400).send("Parâmetros estão undefined!");
    } else if (!fkEmpresa) {
        return res.status(400).send("FK empresa está undefined!");
    }

    try {
        for (var i = 0; i < parametros.length; i++) {
            console.log('Entrou para cadastrar tipo parâmetro');

            await modeloModel.cadastrarTipoParametro(parametros[i].componente);
            console.log("Tipo parâmetro cadastrado com sucesso!");

            const resultadoBuscarIdTipoParametro = await modeloModel.buscarIdTipoParametro();
            console.log("Entrou para buscar id tipo parâmetro");

            fkTipoParametro.push(resultadoBuscarIdTipoParametro[0]);
            console.log("Id tipo parâmetro cadastrado com sucesso!", resultadoBuscarIdTipoParametro);
        }

        console.log('Entrou para cadastrar modelo');
        await modeloModel.cadastrarModelo(nomeModelo, descricao, fkEmpresa);
        console.log("Modelo cadastrado com sucesso!");

        console.log('Entrou para buscar id modelo');
        const resultadoBuscarIdModelo = await modeloModel.buscarIdModelo();
        fkModelo = resultadoBuscarIdModelo[0];
        console.log("Id modelo buscado com sucesso!", resultadoBuscarIdModelo);

        for (var i = 0; i < parametros.length; i++) {
            console.log('Entrou para cadastrar parâmetro');
            await modeloModel.cadastrarParametro(
                parametros[i].limiteMaximo,
                parametros[i].limiteMinimo,
                fkModelo.idModelo,
                fkTipoParametro[i].idTipoParametro
            );
            console.log('Parâmetro cadastrado com sucesso!');
        }

        res.status(200).send("Modelo e parâmetros cadastrados com sucesso!");
    } catch (erro) {
        console.error("Erro ao cadastrar modelo:", erro.sqlMessage || erro);
        res.status(500).json(erro.sqlMessage || erro);
    }
}

module.exports = {
    cadastrarModelo
};