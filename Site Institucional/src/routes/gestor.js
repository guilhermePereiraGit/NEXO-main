var express = require("express");
var router = express.Router();

var gestorController = require("../controllers/gestorController");

// router.post("/cadastrarEndereco", function (req, res) {
//     enderecoController.cadastrarEndereco(req, res);
// })

router.post("/buscarRegioes", function (req, res){
    gestorController.buscarRegioes(req, res);
})

router.post("/buscarModelos", function (req, res){
    gestorController.buscarModelos(req, res);
})

router.post("/buscarTotens", function (req, res){
    gestorController.buscarTotens(req, res);
})

module.exports = router;
