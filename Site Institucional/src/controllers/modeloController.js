var modeloModel = require("../models/modeloModel");
const { param } = require("../routes/modelo");

async function cadastrarModelo(req, res) {
    var nomeModelo = req.body.nomeModeloServer;
    var descricao = req.body.descricaoServer;
    var parametros = req.body.parametrosServer;
    var fkEmpresa = req.body.fkEmpresaServer;
    var fkTipoParametroVariavel = 0;
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
            console.log('Entrou no for')
            const resultadoBuscarSeTipoParametroJaExiste = await modeloModel.buscarSeTipoParametroJaExiste(parametros[i].componente);

            if (resultadoBuscarSeTipoParametroJaExiste.length > 0) {
                fkTipoParametroVariavel = resultadoBuscarSeTipoParametroJaExiste[0].idTipoParametro;
                console.log("Tipo de parâmetro já existente. ID:", fkTipoParametroVariavel);
            } else {
                await modeloModel.cadastrarTipoParametro(parametros[i].componente);
                console.log("Novo tipo de parâmetro cadastrado com sucesso!");

                const resultadoBuscarIdTipoParametro = await modeloModel.buscarIdTipoParametro();
                fkTipoParametroVariavel = resultadoBuscarIdTipoParametro[0].idTipoParametro;
                console.log("Novo ID cadastrado:", fkTipoParametroVariavel);
            }

            fkTipoParametro.push(fkTipoParametroVariavel);
        }

        console.log('Entrou saiu do for')


        await modeloModel.cadastrarModelo(nomeModelo, descricao, fkEmpresa);
        console.log("Modelo cadastrado com sucesso!");

        const resultadoBuscarIdModelo = await modeloModel.buscarIdModelo();
        fkModelo = resultadoBuscarIdModelo[0];
        console.log("Id modelo buscado com sucesso!", resultadoBuscarIdModelo);

        for (var i = 0; i < parametros.length; i++) {
            await modeloModel.cadastrarParametro(
                fkModelo.idModelo,
                fkTipoParametro[i]
            );

            console.log('Parâmetro cadastrado com sucesso!');
        }

        res.status(200).send("Modelo e parâmetros cadastrados com sucesso!");
    } catch (erro) {
        console.error("Erro ao cadastrar modelo:", erro.sqlMessage || erro);
        res.status(500).json(erro.sqlMessage || erro);
    }
}

async function buscarTipoParametro(req, res) {
    var fkEmpresa = req.body.fkEmpresaServer
    var parametros = []

    resultadoBuscaTipoParametro = await modeloModel.buscarTipoParametro(fkEmpresa)

    if (resultadoBuscaTipoParametro.length > 0) {
        for (var i = 0; i < resultadoBuscaTipoParametro.length; i++) {
            parametros.push(resultadoBuscaTipoParametro[i])
        }
    } else {
        parametros.push('CPU', 'RAM', 'DISCO')
    }

    res.json(parametros)
}

async function buscarModelos(req, res) {
    var fkEmpresa = req.body.fkEmpresaServer;
    var modelos = []

    if (fkEmpresa == undefined) {
        console.log('O ID da empresa está undefined')
    } else {
        modelos = await modeloModel.buscarModelos(fkEmpresa)

        if (modelos.length > 0) {
            res.json(modelos)
        } else {
            console.log('Erro ao buscar os modelos')
            res.status(500)
        }
    }
}

function verificarAprovados(req, res) {
    modeloModel.verificarAprovados()
        .then(
            function (resultado) {
                res.json(resultado);
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao realizar Verificação! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
}

async function buscarModelosCadastrados(req, res){
    var modelos = await modeloModel.buscarModelosCadastrados();
    res.json(modelos)
}

module.exports = {
    cadastrarModelo, buscarTipoParametro, buscarModelos, verificarAprovados, buscarModelosCadastrados
};