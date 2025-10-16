var enderecoModel = require("../models/enderecoModel");

async function cadastrarEndereco(req, res) {
    const { cepServer: cep, estadoServer: estado, bairroServer: bairro,
            cidadeServer: cidade, ruaServer: rua, numeroServer: numero,
            complementoServer: complemento } = req.body;

    if (!cep || !estado || !bairro || !cidade || !rua || !numero || !complemento) {
        return res.status(400).json({ erro: "Parâmetros estão undefined!" });
    }

    try {
        const resultadoInsert = await enderecoModel.cadastrarEndereco(
            cep, estado, bairro, cidade, rua, numero, complemento
        );

        const idEndereco = resultadoInsert.insertId;

        console.log("Endereço cadastrado com sucesso! ID:", idEndereco);

        res.status(201).json({ idEndereco });
    } catch (erro) {
        console.error("Erro ao cadastrar endereço:", erro.sqlMessage || erro);
        res.status(500).json({ erro: erro.sqlMessage || erro });
    }
}

module.exports = {
    cadastrarEndereco
};