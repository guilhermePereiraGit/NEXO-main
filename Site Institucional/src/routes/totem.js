var express = require("express");
var router = express.Router();
var totemController = require("../controllers/totemController");
const axios = require('axios');
const mysql = require('mysql2');

const pool = mysql.createPool({
  connectionString: process.env.DATABASE_URL,  // No .env: mysql://user:pass@host:3306/db
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

router.post("/nearest-totem", async (req, res) => {
  const { userLat, userLon } = req.body;
  if (!userLat || !userLon) {
    return res.status(400).json({ erro: 'Lat/lon do usuário requeridos.' });
  }

  try {
    pool.query(`
      SELECT t.numMac, e.cep, e.lat, e.lon
      FROM totem t
      INNER JOIN endereco e ON t.fkEndereco = e.idEndereco
    `, async (err, totens) => {
      if (err) throw err;

      const totensWithDist = await Promise.all(totens.map(async (totem) => {
        let lat = totem.lat;
        let lon = totem.lon;

        if (!lat || !lon) {
          const cep = totem.cep.replace(/\D/g, '');
          const response = await axios.get(`https://cep.awesomeapi.com.br/json/${cep}`);
          lat = parseFloat(response.data.lat);
          lon = parseFloat(response.data.lng);

          pool.query('UPDATE endereco SET lat = ?, lon = ? WHERE cep = ?', [lat, lon, totem.cep], (updateErr) => {
            if (updateErr) console.error('Erro ao atualizar cache:', updateErr);
          });
        }

        const dist = haversineDistance(userLat, userLon, lat, lon);
        return { macTotem: totem.numMac, distanciaKm: dist };
      }));

      const nearest = totensWithDist.reduce((min, curr) => curr.distanciaKm < min.distanciaKm ? curr : min, { distanciaKm: Infinity });

      res.json(nearest);
    });
  } catch (err) {
    console.error('Erro:', err.message);
    res.status(500).json({ erro: 'Erro ao calcular totem mais próximo: ' + err.message });
  }
});

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
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