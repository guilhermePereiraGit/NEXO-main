// src/script/s3Sergio.js
var AWS = require('aws-sdk');
var Papa = require('papaparse');

// região via .env igual ao ZIP
AWS.config.update({ region: process.env.AWS_REGION });
var s3 = new AWS.S3();

async function lerArquivo(req, res) {
  try {
    // vem assim da URL:  "1%2Fdash%2Fdashboard.json"
    var fileKeyEncoded = req.params.arquivo;
    var fileKey = decodeURIComponent(fileKeyEncoded);

    // validação parecida com a do ZIP, mas aceitando "/"
    if (!/^[\w.\-\/]+$/.test(fileKey)) {
      return res.status(400).send('❌ Nome de arquivo inválido.');
    }

    var params = {
      Bucket: process.env.S3_BUCKET, // ex: bucket-client-nexo
      Key: fileKey
    };

    console.log('📥 Lendo do S3 (Sergio): ' + params.Bucket + '/' + params.Key);

    var data = await s3.getObject(params).promise();
    var text = data.Body.toString('utf-8').trim();

    var content;

    // MESMA LÓGICA DO ZIP: se começa com { ou [, tratamos como JSON
    if (text.startsWith('[') || text.startsWith('{')) {
      content = JSON.parse(text);
    } else {
      // senão, tenta CSV com PapaParse (igual no exemplo)
      var parsed = Papa.parse(text, {
        header: true,
        delimiter: text.indexOf(';') !== -1 ? ';' : ',',
        skipEmptyLines: true
      });
      content = parsed.data;
    }

    res.json(content);
  } catch (err) {
    console.error('❌ Erro ao buscar arquivo:', err.message);
    res.status(500).send('Erro ao buscar arquivo: ' + err.message);
  }
}

module.exports = {
  lerArquivo: lerArquivo
};