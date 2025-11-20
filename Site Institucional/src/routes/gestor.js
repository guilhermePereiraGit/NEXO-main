var express = require("express");
var router = express.Router();

var gestorController = require("../controllers/gestorController");

// router.post("/cadastrarEndereco", function (req, res) {
//     enderecoController.cadastrarEndereco(req, res);
// })

router.post("/buscarRegioes", function (req, res){
    gestorController.buscarRegioes(req, res);
})

module.exports = router;
