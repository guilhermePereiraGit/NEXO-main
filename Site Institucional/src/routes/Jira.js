var express = require("express");
var router = express.Router();
const visualizarChamadosJira = require("../controllers/JiraController");

router.get("/visualizarChamadosJira", function (req, res) {
    visualizarChamadosJira(req, res);
})

module.exports = router;