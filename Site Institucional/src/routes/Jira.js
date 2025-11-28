var express = require("express");
var router = express.Router();
const visualizarChamadosJira = require("../controllers/JiraController");

router.get("/visualizarChamadosJira", function (req, res) {
    visualizarChamadosJira(req, res);
})
router.get("/buscarInfosTotem", function (req, res) {
    buscarInfosTotem(req,res);
})

module.exports = router;