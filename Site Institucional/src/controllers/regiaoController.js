var regiaoModel = require("../models/regiaoModel");

function guardar(req, res) {
    idRegiao = req.body.idRegiao;
    regiaoModel.guardar(idRegiao)
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

function alterar(req, res) {
    alterar_itens = req.body.alterar_itens;
    regiaoModel.alterar(alterar_itens)
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

function excluirArea(req, res) {
    regiao = req.body.regiao;
    usuario = req.body.usuario;
    regiaoModel.excluirArea(regiao,usuario)
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

module.exports = {
    guardar,alterar,excluirArea
};
