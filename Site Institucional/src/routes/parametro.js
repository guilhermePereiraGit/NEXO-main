var express = require("express");
var router = express.Router();

var parametroController = require("../controllers/parametroController");

router.post("/cadastrarTipoParametro", function (req, res) {
    parametroController.cadastrarTipoParametro(req, res);
})

module.exports = router;
