var express = require("express");
var router = express.Router();

var enderecoController = require("../controllers/enderecoController");

router.post("/cadastrarEndereco", function (req, res) {
    enderecoController.cadastrarEndereco(req, res);
})

router.get("/buscarEstados", function (req, res){
    enderecoController.buscarEstados(req, res);
})

router.post("/buscarRegioes", function (req, res){
    enderecoController.buscarRegioes(req, res);
})

router.post("/buscarZonas", function (req, res){
    enderecoController.buscarZonas(req, res);
})

router.post("/cadastrarEnderecoTotem", function (req, res){
    enderecoController.cadastrarEnderecoTotem(req, res);
})

module.exports = router;
