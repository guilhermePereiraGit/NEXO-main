var express = require("express");
var router = express.Router();

var aprovacaoController = require("../controllers/aprovacaoController");

router.get("/verificar", function (req, res) {
    aprovacaoController.verificar(req, res);
})

router.get("/verificarAprovados", function (req, res) {
    aprovacaoController.verificarAprovados(req, res);
})

router.post("/aprovar", function (req, res) {
    aprovacaoController.aprovar(req, res);
})

router.post("/recusar", function (req, res) {
    aprovacaoController.recusar(req, res);
})

module.exports = router;
