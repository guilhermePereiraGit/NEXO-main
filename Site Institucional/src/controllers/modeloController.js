var modeloModel = require("../models/modeloModel");

async function cadastrarModelo(req, res) {
    var nomeModelo = req.body.nomeModeloServer;
    var descricao = req.body.descricaoServer;
    var parametros = req.body.parametrosServer; 
    var fkEmpresa = req.body.fkEmpresaServer;

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
            const resultadoBuscarSeTipoParametroJaExiste =
                await modeloModel.buscarSeTipoParametroJaExiste(parametros[i].componente.toUpperCase()); 

            if (resultadoBuscarSeTipoParametroJaExiste.length == 0) {
                 await modeloModel.cadastrarTipoParametro(parametros[i].componente.toUpperCase());
            }
        }

        const resultadoCadastroModelo = await modeloModel.cadastrarModelo(nomeModelo, descricao, fkEmpresa);
        
        var idModeloCadastrado = resultadoCadastroModelo.insertId;

        for (var i = 0; i < parametros.length; i++) {
            await modeloModel.cadastrarValoresParametro(
                idModeloCadastrado,
                parametros[i].componente, 
                parametros[i].limiteMin,
                parametros[i].limiteMax
            );
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
    var idEmpresa = req.body.idEmpresaServer

    modeloModel.verificarAprovados(idEmpresa)
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

async function buscarDefaults(req, res) {
    try {
        var defaults = await modeloModel.buscarDefaults();
        res.status(200).json(defaults);
    } catch (erro) {
        console.error("Erro ao buscar defaults:", erro.sqlMessage || erro);
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

async function buscarModeloPorId(req, res) {
    var idModelo = req.query.id;

    if (!idModelo) {
        return res.status(400).send("ID do modelo não foi fornecido.");
    }

    try {
        const info = await modeloModel.buscarInfoModelo(idModelo);
        const parametros = await modeloModel.buscarParametrosDoModelo(idModelo);

        if (info.length > 0) {
            res.json({
                info: info[0],
                parametros: parametros 
            });
        } else {
            res.status(404).send("Modelo não encontrado.");
        }
    } catch (erro) {
        console.error("Erro ao buscar modelo por ID:", erro.sqlMessage || erro);
        res.status(500).json(erro.sqlMessage || erro);
    }
}

async function atualizarModelo(req, res) {
    var idModelo = req.body.idModeloServer;
    var nomeModelo = req.body.nomeModeloServer;
    var descricao = req.body.descricaoServer;
    var parametros = req.body.parametrosServer; 

    if (!idModelo || !nomeModelo || !descricao || !parametros) {
        return res.status(400).send("Dados incompletos para atualização.");
    }

    try {
        await modeloModel.atualizarInfoModelo(idModelo, nomeModelo, descricao);
        await modeloModel.deletarParametrosDoModelo(idModelo);

        for (var i = 0; i < parametros.length; i++) {
            await modeloModel.cadastrarValoresParametro(
                idModelo,
                parametros[i].componente,
                parametros[i].limiteMin,
                parametros[i].limiteMax
            );
        }

        res.status(200).send("Modelo atualizado com sucesso!");
    } catch (erro) {
        console.error("Erro ao atualizar modelo:", erro.sqlMessage || erro);
        res.status(500).json(erro.sqlMessage || erro);
    }
}


module.exports = {
    cadastrarModelo, buscarTipoParametro, buscarModelos, verificarAprovados,buscarModelosCadastrados, cadastrarParametro, 
    buscarDefaults, buscarModeloPorId, atualizarModelo
};