var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
})

router.post("/cadastrarFuncionario", function (req, res) {
    usuarioController.cadastrarFuncionario(req, res);
})

router.post("/deletarFuncionario", function (req, res) {
    usuarioController.deletarFuncionario(req, res);
})

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
})

router.post("/verificarUsuarios", function (req, res) {
    usuarioController.verificarUsuarios(req, res);
})

// Função para Excluir Empresa
router.post("/limparFuncionarios", function (req, res) {
    usuarioController.limparFuncionarios(req, res);
})

router.post("/deletarEmpresa", function (req, res) {
    usuarioController.deletarEmpresa(req, res);
})

module.exports = router;
