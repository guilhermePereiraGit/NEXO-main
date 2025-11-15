var express = require("express");
var router = express.Router();

var adicionarController = require("../controllers/adicionarController");

router.post("/cadastrarEndGestor", function (req, res) {
    adicionarController.cadastrarEndGestor(req, res);
})

router.post("/cadastrarEndZona", function (req, res) {
    adicionarController.cadastrarEndZona(req, res);
})

module.exports = router;
