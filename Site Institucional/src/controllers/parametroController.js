var parametroModel = require("../models/parametroModel");

function buscarTipoParametro(_, res) {
    parametroModel.buscarTipoParametro()
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

function cadastrarTipoParametro(req, res) {
    var componente = req.body.nomeServer;
    var limiteMaximo = req.body.limiteMaximoServer;
    var limiteMinimo = req.body.limiteMinimoServer;

    if (componente == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else {

        parametroModel.cadastrarTipoParametro(componente, limiteMaximo, limiteMinimo)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

module.exports = {
    buscarTipoParametro, cadastrarTipoParametro
};