const express = require('express');
const router = express.Router();
const path = require('path');

var s3Controller = require('../controllers/s3Controller');

router.get('/dados/:diretorio/:conteudo', (req, res) => {
    s3Controller.lerArquivo(req, res);
});

router.get('/:diretorio/:mac/:data/:conteudo', (req, res) => {
    s3Controller.lerArquivoBarros(req, res);
});

module.exports = router;
