var express = require("express");
var router = express.Router();

var totemController = require("../controllers/totemController");

router.post("/cadastrarTotem", function (req, res) {
    totemController.cadastrarTotem(req, res);
})

router.post("/verificarAprovados", function (req, res){
    totemController.verificarAprovados(req, res);
})

router.post("/modificarStatusTotem", function(req, res){
    totemController.modificarStatusTotem(req, res);
})

router.get("/buscarTotens", function (req, res) {
    totemController.buscarTotens(req, res);
})

router.get("/buscarEnderecoTotem/:mac", function (req, res) {
    totemController.buscarEnderecoTotem(req, res);
});


module.exports = router;
