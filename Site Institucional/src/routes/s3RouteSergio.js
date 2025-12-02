// src/routes/s3RouteSergio.js
var express = require('express');
var router = express.Router();
var path = require('path');

var s3SergioController = require('../script/s3Sergio');

// mesma rota /dados/:arquivo do ZIP
router.get('/dados/:arquivo', function (req, res) {
  s3SergioController.lerArquivo(req, res);
});

// opcional, mas deixa igual ao ZIP: rota /ver
router.get('/ver/:arquivo', function (req, res) {
  res.sendFile(path.join(__dirname, '../../public', 'index.html'));
});

module.exports = router;