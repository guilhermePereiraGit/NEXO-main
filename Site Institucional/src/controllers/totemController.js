var totemModel = require("../models/totemModel");

async function cadastrarTotem(req, res) {
    var vies = req.body.viesServer;
    var modelo = req.body.modeloServer;
    var enderecosMac = req.body.enderecosMacServer;
    var fkEndereco = req.body.fkEnderecoServer;

    if (vies == undefined) {
        return res.status(400).send("Parâmetros estão undefined!");
    } else if (modelo == undefined) {
        return res.status(400).send("Parâmetros estão undefined!");
    } else if (enderecosMac == undefined) {
        return res.status(400).send("Parâmetros estão undefined!");
    } else if (fkEndereco == undefined) {
        return res.status(400).send("Parâmetros estão undefined!");
    }

    for (var i = 0; i < enderecosMac.length; i++) {

        try {
            await totemModel.cadastrarTotem(vies, modelo, enderecosMac[i], fkEndereco)
            res.status(200).json({ mensagem: "Totens cadastrados com sucesso!" });
        }
        catch (erro) {
            console.error("Erro ao cadastrar endereço:", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage || erro);
        }
    }
}

module.exports = {
    cadastrarTotem
};