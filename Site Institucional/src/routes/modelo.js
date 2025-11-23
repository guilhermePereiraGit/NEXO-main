var express = require("express");
var router = express.Router();

var modeloController = require("../controllers/modeloController");

router.post("/buscarDefaults", function (req, res) {
    modeloController.buscarDefaults(req, res);
});

router.post("/verificarAprovados", function (req, res) {
    modeloController.verificarAprovados(req, res);
});

router.post("/cadastrarModelo", function (req, res) {
    modeloController.cadastrarModelo(req, res);
});

router.get("/buscarModeloPorId", function (req, res) {
    modeloController.buscarModeloPorId(req, res);
});

router.put("/atualizarModelo", function (req, res) {
    modeloController.atualizarModelo(req, res);
});

module.exports = router;
