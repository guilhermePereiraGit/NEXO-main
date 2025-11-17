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

router.post("/verificarAprovados", function (req, res){
    modeloController.verificarAprovados(req, res);
})

router.post("/buscarModelosCadastrados", function(req, res){
    modeloController.buscarModelosCadastrados(req, res);
})

router.post("/cadastrarParametro", function(req, res){
    modeloController.cadastrarParametro(req, res)
})

router.post("/buscarDefaults", function (req, res){
    modeloController.buscarDefaults(req, res);
})

router.get("/buscarModeloPorId", function (req, res) {
    modeloController.buscarModeloPorId(req, res);
});

router.put("/atualizarModelo", function (req, res) {
    modeloController.atualizarModelo(req, res);
});


module.exports = router;