var totemModel = require("../models/totemModel");

async function cadastrarTotem(req, res) {
    var vies = req.body.viesServer;
    var modelo = req.body.modeloServer;
    var enderecosMac = req.body.enderecosMacServer;
    var fkEndereco = req.body.fkEnderecoServer;

    if (!vies || !modelo || !enderecosMac || !fkEndereco) {
        return res.status(400).send("Parâmetros estão undefined!");
    }

    try {
        for (var i = 0; i < enderecosMac.length; i++) {
            await totemModel.cadastrarTotem(vies, modelo, enderecosMac[i], fkEndereco);
        }
        res.status(200).json({ mensagem: "Tótens cadastrados com sucesso!" });

    } catch (erro) {
        console.error("Erro ao cadastrar tótens:", erro.sqlMessage || erro);
        res.status(500).json({ erro: erro.sqlMessage || erro });
    }
}


module.exports = {
    cadastrarTotem
};