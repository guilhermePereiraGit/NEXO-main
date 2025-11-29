const express = require('express');
const router = express.Router();
const path = require('path');
var s3Controller = require('../controllers/s3Controller');

router.get('/*', (req, res) => {  // Captura tudo após /dados/
  s3Controller.lerArquivo(req, res);
});

module.exports = router;