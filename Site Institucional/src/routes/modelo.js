var express = require("express");
var router = express.Router();

var modeloController = require("../controllers/modeloController");

router.post("/cadastrarModelo", function (req, res) {
    modeloController.cadastrarModelo(req, res);
})

router.post("/buscarTipoParametro", function (req, res){
    modeloController.buscarTipoParametro(req, res)
})

router.post("/buscarModelos", function (req, res){
    modeloController.buscarModelos(req, res)
})

module.exports = router;