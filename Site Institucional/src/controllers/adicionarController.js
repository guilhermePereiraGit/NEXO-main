var adicionarModel = require("../models/adicionarModel");

function cadastrarEndZona(req, res) {
    zona = req.body.retornoIdZona;
    usuario = req.body.retornoIdUsuario;
    regiao = req.body.retornoIdRegiao;

    adicionarModel.cadastrarEndZona(zona, usuario, regiao)
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

function cadastrarEndGestor(req, res) {
    usuario = req.body.retornoIdUsuario;
    regiao = req.body.retornoIdRegiao;

    adicionarModel.cadastrarEndGestor(usuario, regiao)
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

module.exports = {
    cadastrarEndGestor,cadastrarEndZona
};
