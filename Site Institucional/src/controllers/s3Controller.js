const AWS = require('aws-sdk');
const Papa = require('papaparse');
AWS.config.update({ region: process.env.AWS_REGION });
const s3 = new AWS.S3();

async function lerArquivoMatheus(req, res) {
  try {
    const fileKey = req.params[0];  // Pega o path completo após /dados/
    if (!fileKey || !/^[\w.\-/]+$/.test(fileKey)) {  // Valida com / permitido
      return res.status(400).json({ erro: 'Nome de arquivo inválido.' });
    }
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileKey
    };
    console.log(`📥 Lendo do S3: ${params.Bucket}/${params.Key}`);
    const data = await s3.getObject(params).promise();
    const text = data.Body.toString('utf-8').trim();
    let content;
    if (text.startsWith('[') || text.startsWith('{')) {
      content = JSON.parse(text);
    } else {
      const parsed = Papa.parse(text, {
        header: true,
        delimiter: text.includes(';') ? ';' : ',',
        skipEmptyLines: true
      });
      content = parsed.data;
    }
    res.json(content);
  } catch (err) {
    console.error('❌ Erro ao buscar arquivo:', err.message);
    res.status(500).json({ erro: 'Erro ao buscar arquivo: ' + err.message });
  }
}

module.exports = {
  lerArquivoMatheus
};