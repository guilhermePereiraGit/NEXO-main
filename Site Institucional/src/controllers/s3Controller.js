const AWS = require('aws-sdk');
const { json } = require('express');

AWS.config.update({ region: process.env.AWS_REGION });
const s3 = new AWS.S3();

async function lerArquivo(req, res) {
  try {
    const fileKey = req.params.diretorio + "/" + req.params.conteudo;
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileKey
    };

    //Conferindo o que está sendo lendo
    console.log(`📥 Lendo do S3: ${params.Bucket}/${params.Key}`);

    const data = await s3.getObject(params).promise();
    const text = data.Body.toString('utf-8').trim();

    //Convertendo o text para um arquivo Json
    res.json(JSON.parse(text));

  } catch (err) {
    console.error('❌ Erro ao buscar arquivo:', err.message);
    res.status(500).send('Erro ao buscar arquivo: ' + err.message);
  }
}

async function lerArquivoBarros(req, res) {
  try {
    const fileKey = req.params.diretorio + "/" + req.params.mac + "/" + req.params.dia + "/" + req.params.conteudo;
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileKey
    };

    //Conferindo o que está sendo lendo
    console.log(`📥 Lendo do S3: ${params.Bucket}/${params.Key}`);

    const data = await s3.getObject(params).promise();
    const text = data.Body.toString('utf-8').trim();

    //Convertendo o text para um arquivo Json
    res.json(JSON.parse(text));

  } catch (err) {
    console.error('❌ Erro ao buscar arquivo:', err.message);
    res.status(500).send('Erro ao buscar arquivo: ' + err.message);
  }
}

module.exports = {
  lerArquivo, lerArquivoBarros
};
