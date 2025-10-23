var enderecoModel = require("../models/enderecoModel");

async function cadastrarEndereco(req, res) {
    const cep = req.body.cepServer
    const estado = req.body.estadoServer
    const bairro = req.body.bairroServer
    const cidade = req.body.cidadeServer
    const rua = req.body.ruaServer
    const numero = req.body.numeroServer
    const complemento = req.body.complementoServer
    const zona = req.body.zonaServer

    if (!cep || !estado || !bairro || !cidade || !rua || !numero || !complemento) {
        return res.status(400).json({ erro: "Parâmetros estão undefined!" });
    }

    if (zona == "") {
        try {
            const resultadoBuscarEnderecoExistente = await enderecoModel.buscarEnderecoExistente(cidade, rua, numero, complemento)

            if (resultadoBuscarEnderecoExistente.length > 0) {
                return res.status(200).json({ idEndereco: resultadoBuscarEnderecoExistente[0].idEndereco });
            } else {
                try {
                    const resultadoCadastrarEndereco = await enderecoModel.cadastrarEnderecoSemRegiao(
                        cep, estado, bairro, cidade, rua, numero, complemento
                    );

                    const idEndereco = resultadoCadastrarEndereco.insertId;

                    console.log("Endereço cadastrado com sucesso! ID:", idEndereco);

                    res.status(201).json({ idEndereco });
                } catch (erro) {
                    console.error("Erro ao cadastrar endereço:", erro.sqlMessage || erro);
                    res.status(500).json({ erro: erro.sqlMessage || erro });
                }
            }
        }
        catch (erro) {
            console.error("Erro ao buscar endereço existente:", erro.sqlMessage || erro);
            res.status(500).json({ erro: erro.sqlMessage || erro });
        }
    } else {
        try {
            const resultadoBuscarEnderecoExistente = await enderecoModel.buscarEnderecoExistente(cidade, rua, numero, complemento)

            if (resultadoBuscarEnderecoExistente.length > 0) {
                return res.status(200).json({ idEndereco: resultadoBuscarEnderecoExistente[0].idEndereco });
            } else {
                try {
                    const resultadoCadastrarEndereco = await enderecoModel.cadastrarEnderecoComRegiao(
                        cep, estado, bairro, cidade, rua, numero, complemento, zona
                    );

                    const idEndereco = resultadoCadastrarEndereco.insertId;

                    console.log("Endereço cadastrado com sucesso! ID:", idEndereco);

                    res.status(201).json({ idEndereco });
                } catch (erro) {
                    console.error("Erro ao cadastrar endereço:", erro.sqlMessage || erro);
                    res.status(500).json({ erro: erro.sqlMessage || erro });
                }
            }
        }
        catch (erro) {
            console.error("Erro ao buscar endereço existente:", erro.sqlMessage || erro);
            res.status(500).json({ erro: erro.sqlMessage || erro });
        }
    }
}

module.exports = {
    cadastrarEndereco
};