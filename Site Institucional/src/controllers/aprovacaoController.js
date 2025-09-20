var aprovacaoModel = require("../models/aprovacaoModel");

function verificar(req, res) {
    aprovacaoModel.verificar()
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

function verificarAprovados(req, res) {
    aprovacaoModel.verificarAprovados()
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

function aprovar(req, res) {
    var idEmpresa = req.body.idEmpresaServer;

    if (idEmpresa == undefined) {
        res.status(400).send("Id não Encontrado!");
    } else {

        aprovacaoModel.aprovar(idEmpresa)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar Aprovação! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function recusar(req, res) {
    var idEmpresa = req.body.idEmpresaServer;

    if (idEmpresa == undefined) {
        res.status(400).send("Id não Encontrado!");
    } else {

        aprovacaoModel.recusar(idEmpresa)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar Aprovação! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

module.exports = {
    verificar,verificarAprovados,aprovar,recusar
};
