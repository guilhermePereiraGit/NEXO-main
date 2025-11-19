var totemModel = require("../models/totemModel");

function verificarAprovados(req, res) {
    var idEmpresa = req.body.idEmpresaServer
    
    totemModel.verificarAprovados(idEmpresa)
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

async function buscarTotens(req, res) {
    var fkEmpresa = req.body.fkEmpresaServer;
    var totens = []

    if (fkEmpresa == undefined) {
        console.log('O ID da empresa está undefined')
    } else {
        totens = await totemModel.buscarTotens(fkEmpresa)

        if (modelos.length > 0) {
            res.json(totens)
        } else {
            console.log('Erro ao buscar os totens')
            res.status(500)
        }
    }
}

async function cadastrarTotem(req, res) {
    var modelo = req.body.modeloServer;
    var enderecosMac = req.body.enderecosMacServer;
    var fkEndereco = req.body.fkEnderecoServer;

    if (!modelo || !enderecosMac || !fkEndereco) {
        return res.status(400).send("Parâmetros estão undefined!");
    }

    try {
        for (var i = 0; i < enderecosMac.length; i++) {
            await totemModel.cadastrarTotem(modelo, enderecosMac[i], fkEndereco);
        }
        res.status(200).json({ mensagem: "Tótens cadastrados com sucesso!" });

    } catch (erro) {
        console.error("Erro ao cadastrar tótens:", erro.sqlMessage || erro);
        res.status(500).json({ erro: erro.sqlMessage || erro });
    }
}

async function modificarStatusTotem(req, res){
    var idTotem = req.body.idTotemServer;
    var acao = req.body.acaoServer;

    if(!idTotem || !acao){
        return res.status(400).send("Parâmetros estão undefined!");
    }else{
        if(acao == "ativar"){
            await totemModel.ativarTotem(idTotem);
        }else{
            await totemModel.desativarTotem(idTotem);
        }

        res.status(200).json({ mensagem: "Totem modificado com sucesso" });
    }
}

module.exports = {
    cadastrarTotem, verificarAprovados, modificarStatusTotem
};