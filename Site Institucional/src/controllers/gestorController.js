var gestorModel = require("../models/gestorModel");

function buscarRegioes(req, res) {
    var emailUsuario = req.body.emailUsuario

    gestorModel.buscarRegioes(emailUsuario)
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
    buscarRegioes
};