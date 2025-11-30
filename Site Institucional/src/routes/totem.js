var express = require("express");
var router = express.Router();
var totemController = require("../controllers/totemController");
const axios = require('axios');
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'seu_banco',
  port: process.env.DB_PORT || 3306
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Erro ao conectar ao MySQL:', err.message);
  } else {
    console.log('✅ MySQL conectado com sucesso!');
    connection.release();
  }
});

router.post("/cadastrarTotem", function (req, res) {
    totemController.cadastrarTotem(req, res);
})
router.post("/verificarAprovados", function (req, res){
    totemController.verificarAprovados(req, res);
})
router.post("/modificarStatusTotem", function(req, res){
    totemController.modificarStatusTotem(req, res);
})
router.get("/buscarTotens/:idEmpresa/:idRegiao", function (req, res) {
    totemController.buscarTotens(req, res);
})
router.get("/infoTotem", function (req, res) {
    totemController.buscarInfoTotem(req, res);
})

router.post("/totem/nearest-totem", async (req, res) => {
  let userLat, userLon;
  const { userCep, userLat: providedLat, userLon: providedLon } = req.body;

  try {
    if (userCep) {
      const cep = userCep.replace(/\D/g, '');
      const cepResponse = await axios.get(`https://brasilapi.com.br/api/cep/v2/${cep}`);
      const cepData = cepResponse.data;
      if (cepResponse.status === 200 && cepData.location && cepData.location.coordinates) {
        userLat = parseFloat(cepData.location.coordinates.latitude);
        userLon = parseFloat(cepData.location.coordinates.longitude);
      } else {
        return res.status(400).json({ erro: 'CEP sem coordenadas ou inválido' });
      }
    } else if (providedLat && providedLon) {
      userLat = providedLat;
      userLon = providedLon;
    } else {
      const ipResponse = await axios.get('https://ipapi.co/json/');
      const ipData = ipResponse.data;
      if (ipData.latitude && ipData.longitude) {
        userLat = ipData.latitude;
        userLon = ipData.longitude;
      } else {
        return res.status(400).json({ erro: 'Não foi possível obter localização via IP' });
      }
    }

    pool.query(`
      SELECT t.numMac, e.cep, e.lat, e.lon
      FROM totem t
      INNER JOIN endereco e ON t.fkEndereco = e.idEndereco
    `, async (err, totens) => {
      if (err) return res.status(500).json({ erro: err.message });

      const totensWithDist = await Promise.all(totens.map(async (totem) => {
        let lat = totem.lat;
        let lon = totem.lon;

        if (!lat || !lon) {
          const cep = totem.cep.replace(/\D/g, '');
          const response = await axios.get(`https://brasilapi.com.br/api/cep/v2/${cep}`);
          const data = response.data;
          if (response.status === 200 && data.location && data.location.coordinates) {
            lat = parseFloat(data.location.coordinates.latitude);
            lon = parseFloat(data.location.coordinates.longitude);

            pool.query('UPDATE endereco SET lat = ?, lon = ? WHERE cep = ?', [lat, lon, totem.cep], (updateErr) => {
              if (updateErr) console.error('Erro ao atualizar cache:', updateErr);
            });
          } else {
            return null;
          }
        }

        const dist = haversineDistance(userLat, userLon, lat, lon);
        return { macTotem: totem.numMac, distanciaKm: dist };
      }));

      const filteredTotens = totensWithDist.filter(t => t !== null);
      if (filteredTotens.length === 0) {
        return res.status(404).json({ erro: 'Nenhum totem encontrado com coordenadas válidas' });
      }

      const nearest = filteredTotens.reduce((min, curr) => curr.distanciaKm < min.distanciaKm ? curr : min, { distanciaKm: Infinity });

      res.json(nearest);
    });
  } catch (err) {
    console.error('Erro:', err.message);
    res.status(500).json({ erro: 'Erro ao calcular totem mais próximo: ' + err.message });
  }
});

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;  // Raio da Terra em km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

module.exports = router;