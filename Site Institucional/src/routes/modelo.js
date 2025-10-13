var express = require("express");
var router = express.Router();

var modeloController = require("../controllers/modeloController");

router.post("/cadastrarModelo", function (req, res) {
    modeloController.cadastrarModelo(req, res);
})

module.exports = router;