var express = require("express");
var router = express.Router();

var totemController = require("../controllers/totemController");

router.post("/cadastrarTotem", function (req, res) {
    totemController.cadastrarTotem(req, res);
})

router.get("/verificarAprovados", function (req, res){
    totemController.verificarAprovados(req, res);
})

router.post("/modificarStatusTotem", function(req, res){
    totemController.modificarStatusTotem(req, res);
})

module.exports = router;
