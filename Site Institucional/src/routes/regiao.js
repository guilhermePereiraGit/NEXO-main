var express = require("express");
var router = express.Router();

var regiaoController = require("../controllers/regiaoController");

router.post("/guardar", function (req, res) {
    regiaoController.guardar(req, res);
})

router.post("/alterar", function (req, res) {
    regiaoController.alterar(req, res);
})

module.exports = router;
