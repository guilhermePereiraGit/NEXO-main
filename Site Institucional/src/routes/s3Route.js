const express = require('express');
const router = express.Router();
const path = require('path');
var s3Controller = require('../controllers/s3Controller');

// FETCH MATHEUS
router.get('/dados/*', (req, res) => {
  s3Controller.lerArquivoMatheus(req, res);
});

module.exports = router;