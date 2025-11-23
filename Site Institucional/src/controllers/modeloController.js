var modeloModel = require("../models/modeloModel");
function buscarDefaults(req, res) {

    var fkEmpresa = req.body.fkEmpresaServer;

    modeloModel.buscarDefaults(fkEmpresa)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar defaults: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function verificarAprovados(req, res) {
    var idEmpresa = req.body.idEmpresaServer;

    if (idEmpresa == undefined) {
        res.status(400).json("idEmpresaServer está undefined!");
    } else {
        modeloModel.verificarAprovados(idEmpresa)
            .then(function (resultado) {
                res.json(resultado);
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("Houve um erro ao verificar modelos aprovados: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function cadastrarModelo(req, res) {
    var nomeModelo = req.body.nomeModeloServer;
    var descricao = req.body.descricaoServer;
    var parametros = req.body.parametrosServer;
    var fkEmpresa = req.body.fkEmpresaServer;

    if (nomeModelo == undefined || descricao == undefined || fkEmpresa == undefined) {
        res.status(400).json("Dados do modelo estão incompletos!");
    } else {

        modeloModel.cadastrarModelo(nomeModelo, descricao, fkEmpresa, parametros)
            .then(function (resultadoModelo) {

                var idModelo = resultadoModelo.insertId;
                var valores = "";
                var i = 0;

                if (parametros != null) {
                    for (i = 0; i < parametros.length; i++) {
                        var item = parametros[i];

                        var componente = "";
                        if (item.componente != null) {
                            componente = String(item.componente).toLowerCase();
                        }

                        var fkComponente = 0;

                        if (componente == "cpu") {
                            fkComponente = 1;
                        } else if (componente == "ram") {
                            fkComponente = 2;
                        } else if (componente == "disco") {
                            fkComponente = 3;
                        } else if (componente == "processos") {
                            fkComponente = 4;
                        }

                        if (fkComponente > 0) {
                            var limiteMin = item.limiteMin;
                            var limiteMax = item.limiteMax;

                            if (valores != "") {
                                valores += ", ";
                            }

                            valores += `('${limiteMin}', '${limiteMax}', ${idModelo}, ${fkComponente})`;
                        }
                    }
                }

                if (valores == "") {
                    res.status(201).json({ idModelo: idModelo });
                    return;
                }

                modeloModel.inserirParametros(idModelo, valores)
                    .then(function () {
                        res.status(201).json({ idModelo: idModelo });
                    })
                    .catch(function (erro) {
                        console.log(erro);
                        console.log("Houve um erro ao inserir parâmetros do modelo: ", erro.sqlMessage);
                        res.status(500).json(erro.sqlMessage);
                    });

            })
            .catch(function (erro) {
                console.log(erro);
                console.log("Houve um erro ao cadastrar modelo: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });

    }
}

function buscarModeloPorId(req, res) {
    var idModelo = req.query.id;

    if (idModelo == undefined) {
        res.status(400).json("id do modelo está indefinido");
    } else {

        modeloModel.buscarModeloPorId(idModelo)
            .then(function (resultado) {

                if (resultado.length == 0) {
                    res.status(404).json("Modelo não encontrado");
                } else {
                    var info = {
                        nome: resultado[0].nome,
                        descricao_arq: resultado[0].descricao_arq
                    };

                    var parametros = [];
                    var i = 0;

                    for (i = 0; i < resultado.length; i++) {
                        var linha = resultado[i];

                        if (linha.nomeComponente != null) {
                            parametros.push({
                                nome: linha.nomeComponente,
                                limiteMin: linha.limiteMin,
                                limiteMax: linha.limiteMax
                            });
                        }
                    }

                    res.json({
                        info: info,
                        parametros: parametros
                    });
                }

            })
            .catch(function (erro) {
                console.log(erro);
                console.log("Houve um erro ao buscar o modelo por id: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });

    }
}

function atualizarModelo(req, res) {
    var idModelo = req.body.idModeloServer;
    var nomeModelo = req.body.nomeModeloServer;
    var descricao = req.body.descricaoServer;
    var parametros = req.body.parametrosServer;

    if (idModelo == undefined || nomeModelo == undefined || descricao == undefined) {
        res.status(400).json("Dados para atualizar modelo estão incompletos!");
    } else {

        modeloModel.atualizarModelo(idModelo, nomeModelo, descricao)
            .then(function () {

                return modeloModel.deletarParametros(idModelo);

            })
            .then(function () {

                var valores = "";
                var i = 0;

                if (parametros != null) {
                    for (i = 0; i < parametros.length; i++) {
                        var item = parametros[i];

                        var componente = "";
                        if (item.componente != null) {
                            componente = String(item.componente).toLowerCase();
                        }

                        var fkComponente = 0;

                        if (componente == "cpu") {
                            fkComponente = 1;
                        } else if (componente == "ram") {
                            fkComponente = 2;
                        } else if (componente == "disco") {
                            fkComponente = 3;
                        } else if (componente == "processos") {
                            fkComponente = 4;
                        }

                        if (fkComponente > 0) {
                            var limiteMin = item.limiteMin;
                            var limiteMax = item.limiteMax;

                            if (valores != "") {
                                valores += ", ";
                            }

                            valores += `('${limiteMin}', '${limiteMax}', ${idModelo}, ${fkComponente})`;
                        }
                    }
                }

                if (valores == "") {
                    res.status(200).json({ idModelo: idModelo });
                    return;
                }

                modeloModel.inserirParametros(idModelo, valores)
                    .then(function () {
                        res.status(200).json({ idModelo: idModelo });
                    })
                    .catch(function (erro) {
                        console.log(erro);
                        console.log("Houve um erro ao inserir novos parâmetros do modelo: ", erro.sqlMessage);
                        res.status(500).json(erro.sqlMessage);
                    });

            })
            .catch(function (erro) {
                console.log(erro);
                console.log("Houve um erro ao atualizar modelo: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });

    }
}

module.exports = { buscarDefaults, verificarAprovados, cadastrarModelo, buscarModeloPorId,atualizarModelo
};
