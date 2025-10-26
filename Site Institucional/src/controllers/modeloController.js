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
        console.log("Dados recebidos:", { nomeModelo, descricao, parametros, fkEmpresa });

        for (var i = 0; i < parametros.length; i++) {
            console.log(`Iteração ${i + 1} - componente:`, parametros[i].componente);

            const resultadoBuscarSeTipoParametroJaExiste =
                await modeloModel.buscarSeTipoParametroJaExiste(parametros[i].componente);

            console.log("Resultado busca tipo:", resultadoBuscarSeTipoParametroJaExiste);

            if (resultadoBuscarSeTipoParametroJaExiste.length > 0) {
                fkTipoParametroVariavel = resultadoBuscarSeTipoParametroJaExiste[0].idTipoParametro;
                console.log("Tipo existente:", fkTipoParametroVariavel);
            } else {
                console.log("Cadastrando novo tipo...");
                await modeloModel.cadastrarTipoParametro(parametros[i].componente);

                const resultadoBuscarIdTipoParametro = await modeloModel.buscarIdTipoParametro();
                fkTipoParametroVariavel = resultadoBuscarIdTipoParametro[0].idTipoParametro;
                console.log("Novo tipo cadastrado:", fkTipoParametroVariavel);
            }

            fkTipoParametro.push(fkTipoParametroVariavel);
        }

        console.log("Saiu do for de tipoParametro, cadastrando modelo...");
        await modeloModel.cadastrarModelo(nomeModelo, descricao, fkEmpresa);

        const resultadoBuscarIdModelo = await modeloModel.buscarIdModelo();
        console.log("Resultado buscarIdModelo:", resultadoBuscarIdModelo);

        fkModelo = resultadoBuscarIdModelo[0];
        console.log("ID modelo:", fkModelo);

        for (var i = 0; i < parametros.length; i++) {
            console.log(`Cadastrando parâmetro ${i + 1}: tipoParametro = ${fkTipoParametro[i]}`);
            await modeloModel.cadastrarParametro(fkModelo.idModelo, fkTipoParametro[i]);
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

async function buscarModelosCadastrados(req, res) {
    try {
        var idEmpresa = req.body.idEmpresaServer;

        if (!idEmpresa) {
            return res.status(400).send("ID da empresa não informado.");
        }

        var modelos = await modeloModel.buscarModelosCadastrados(idEmpresa);

        if (modelos.length > 0) {
            res.status(200).json(modelos);
        } else {
            res.status(204).send("Nenhum modelo encontrado para esta empresa.");
        }

    } catch (erro) {
        console.error("Erro ao buscar modelos:", erro);
        res.status(500).json(erro.sqlMessage || erro);
    }
}

async function cadastrarParametro(req, res) {
    var parametros = req.body;

    try {
        var resultadoBuscarParametro = await modeloModel.buscarParametro(parametros[0].idModelo)
        if (resultadoBuscarParametro.length > 0) {
            for (var i = 0; i < parametros.length; i++) {
                await modeloModel.atualizarParametro(
                    parametros[i].idModelo,
                    parametros[i].nomeParametro,
                    parametros[i].limiteMin,
                    parametros[i].limiteMax
                );
            }
            return res.status(200).send("Parâmetros cadastrados com sucesso!");
        } else {
            for (var i = 0; i < parametros.length; i++) {
                await modeloModel.cadastrarValoresParametro(
                    parametros[i].idModelo,
                    parametros[i].nomeParametro,
                    parametros[i].limiteMin,
                    parametros[i].limiteMax
                );
            }
            return res.status(200).send("Parâmetros cadastrados com sucesso!");
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Erro ao cadastrar parâmetros.");
    }
}

module.exports = {
    cadastrarModelo, buscarTipoParametro, buscarModelos, verificarAprovados,
    buscarModelosCadastrados, cadastrarParametro
};