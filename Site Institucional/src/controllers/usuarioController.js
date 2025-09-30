var usuarioModel = require("../models/usuarioModel");

//Cadastro de Empresas
function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var cnpj = req.body.cnpjServer;
    var telefone = req.body.telefoneServer;

    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (cnpj == undefined) {
        res.status(400).send("Seu cnpj está undefined!");
    } else if (telefone == undefined) {
        res.status(400).send("Seu telefone está undefined!");
    } else {

        usuarioModel.cadastrar(nome, email, cnpj, senha, telefone)
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

function cadastrarFuncionario(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var cpf = req.body.cpfServer;
    var telefone = req.body.telefoneServer;
    var cargo = req.body.cargoServer;
    var fkEmpresa = req.body.fkEmpresa;

    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (cpf == undefined) {
        res.status(400).send("Seu cpf está undefined!");
    } else if (telefone == undefined) {
        res.status(400).send("Seu telefone está undefined!");
    } else if (cargo == undefined) {
        res.status(400).send("Seu cargo está undefined!");
    } else if (fkEmpresa == undefined) {
        res.status(400).send("Sua empresa está undefined!");
    } else {

        usuarioModel.cadastrarFuncionario(nome, email, cpf, senha, telefone,cargo,fkEmpresa)
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

function deletarFuncionario(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var fkEmpresa = req.body.fkEmpresa;

    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (fkEmpresa == undefined) {
        res.status(400).send("Sua empresa está undefined!");
    } else {

        usuarioModel.deletarFuncionario(nome, email,fkEmpresa)
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

//Login de Empresas
function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    }
    else {
        //Tentando acessar como usuário Empresa
        usuarioModel.autenticarEmpresa(email, senha)
            .then(function (resultadoAutenticarEmpresa) {
                if (resultadoAutenticarEmpresa.length == 1) {
                    console.log(resultadoAutenticarEmpresa);

                    if (resultadoAutenticarEmpresa[0].status == "APROVADO") {
                        res.json({
                            idEmpresa: resultadoAutenticarEmpresa[0].idEmpresa,
                            email: resultadoAutenticarEmpresa[0].email,
                            nome: resultadoAutenticarEmpresa[0].nome,
                            cnpj: resultadoAutenticarEmpresa[0].cnpj,
                            senha: resultadoAutenticarEmpresa[0].senha,
                            telefone: resultadoAutenticarEmpresa[0].telefone,
                            status: "empresa"
                        });
                    } else if (resultadoAutenticarEmpresa[0].status == "EM ANÁLISE") {
                        res.json({
                            idEmpresa: resultadoAutenticarEmpresa[0].idEmpresa,
                            email: resultadoAutenticarEmpresa[0].email,
                            nome: resultadoAutenticarEmpresa[0].nome,
                            cnpj: resultadoAutenticarEmpresa[0].cnpj,
                            senha: resultadoAutenticarEmpresa[0].senha,
                            telefone: resultadoAutenticarEmpresa[0].telefone,
                            status: "aprovacao"
                        });
                    }

                } else {
                    //Tentando acessar como usuário Funcionário da Empresa
                    usuarioModel.autenticarUsuario(email, senha)
                        .then(function (resultadoAutenticarUsuario) {
                            if (resultadoAutenticarUsuario.length == 1) {
                                console.log(resultadoAutenticarUsuario);

                                res.json({
                                    idUsuario: resultadoAutenticarUsuario[0].idUsuario,
                                    email: resultadoAutenticarUsuario[0].email,
                                    nome: resultadoAutenticarUsuario[0].nome,
                                    cargo: resultadoAutenticarUsuario[0].cargo,
                                    senha: resultadoAutenticarUsuario[0].senha,
                                    telefone: resultadoAutenticarUsuario[0].telefone,
                                    cpf: resultadoAutenticarUsuario[0].cpf,
                                    fkEmpresa:resultadoAutenticarUsuario[0].fkEmpresa,
                                    status: "funcionario"
                                });
                            }
                            else {
                                //Tentando acessar como usuário Adminstrativo da NEXO
                                usuarioModel.autenticarAdm(email, senha)
                                    .then(function (resultadoAutenticarAdm) {
                                        if (resultadoAutenticarAdm.length == 1) {
                                            console.log(resultadoAutenticarAdm);

                                            res.json({
                                                idUsuario: resultadoAutenticarAdm[0].idUsuarioNexo,
                                                email: resultadoAutenticarAdm[0].email,
                                                nome: resultadoAutenticarAdm[0].nome,
                                                senha: resultadoAutenticarAdm[0].senha,
                                                status: "administrador"
                                            });
                                        } else {
                                            res.status(403).send("Mais de um usuário com o mesmo login e senha!");

                                        }
                                    })
                                    .catch(
                                        function (erro) {
                                            console.log(erro);
                                            console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                                            res.status(500).json(erro.sqlMessage);
                                        }
                                    );
                            }
                        })
                        .catch(
                            function (erro) {
                                console.log(erro);
                                console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                                res.status(500).json(erro.sqlMessage);
                            }
                        );
                }
            })
            .catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function verificarUsuarios(req, res) {
    var idEmpresa = req.body.idEmpresaServer;

    usuarioModel.verificarUsuarios(idEmpresa)
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


// Funções para Apagar Empresa
function limparFuncionarios(req, res) {
    var fkEmpresa = req.body.fkEmpresa;

    if (fkEmpresa == undefined) {
        res.status(400).send("Sua empresa está undefined!");
    } else {

        usuarioModel.limparFuncionarios(fkEmpresa)
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

function deletarEmpresa(req, res) {
    var idEmpresa = req.body.idEmpresa;

    if (idEmpresa == undefined) {
        res.status(400).send("Seu Id está undefined!");
    } else {

        usuarioModel.deletarEmpresa(idEmpresa)
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
    cadastrar, autenticar,verificarUsuarios,cadastrarFuncionario,deletarFuncionario,limparFuncionarios,deletarEmpresa
};
