var express = require("express");
var router = express.Router();

var aprovacaoController = require("../controllers/aprovacaoController");

router.get("/verificar", function (req, res) {
    aprovacaoController.verificar(req, res);
})

router.get("/verificarAprovados", function (req, res) {
    aprovacaoController.verificarAprovados(req, res);
})

module.exports = router;
