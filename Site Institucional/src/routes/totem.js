var express = require("express");
var router = express.Router();
var totemController = require("../controllers/totemController");
const axios = require('axios');
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Erro MySQL na rota totem:', err.message);
  } else {
    console.log('✅ MySQL conectado na rota totem!');
    connection.release();
  }
});

router.post("/cadastrarTotem", function (req, res) {
  totemController.cadastrarTotem(req, res);
})

router.post("/verificarAprovados", function (req, res) {
  totemController.verificarAprovados(req, res);
})

router.post("/modificarStatusTotem", function (req, res) {
  totemController.modificarStatusTotem(req, res);
})

router.get("/buscarTotens/:idEmpresa/:idRegiao", function (req, res) {
  totemController.buscarTotens(req, res);
})

router.get("/infoTotem", function (req, res) {
  totemController.buscarInfoTotem(req, res);
})

router.post("/nearest-totem", async (req, res) => {
  let userLat, userLon;
  const { userCep, userLat: providedLat, userLon: providedLon } = req.body;

  console.log('📍 Requisição recebida em /nearest-totem');
  console.log('Dados:', { userCep, providedLat, providedLon });

  try {
    // Determina localização do usuário
    if (userCep) {
      console.log('🔍 Buscando coordenadas por CEP:', userCep);
      const cep = userCep.replace(/\D/g, '');
      const cepResponse = await axios.get(`https://brasilapi.com.br/api/cep/v2/${cep}`);
      const cepData = cepResponse.data;

      if (cepResponse.status === 200 && cepData.location && cepData.location.coordinates) {
        userLat = parseFloat(cepData.location.coordinates.latitude);
        userLon = parseFloat(cepData.location.coordinates.longitude);
        console.log('✅ Coordenadas usuário via CEP:', { userLat, userLon });
      } else {
        return res.status(400).json({ erro: 'CEP sem coordenadas ou inválido' });
      }
    } else if (providedLat && providedLon) {
      userLat = parseFloat(providedLat);
      userLon = parseFloat(providedLon);
      console.log('✅ Usando coordenadas fornecidas:', { userLat, userLon });
    } else {
      console.log('🌐 Tentando geolocalização por IP...');

      // Pega o IP real do cliente (considera proxies como ELB, Nginx, CloudFlare)
      let clientIP = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
        req.headers['x-real-ip'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress;

      // Remove o prefixo IPv6 se presente (::ffff:)
      if (clientIP && clientIP.includes('::ffff:')) {
        clientIP = clientIP.replace('::ffff:', '');
      }

      console.log('🔍 IP do cliente detectado:', clientIP);

      try {
        // Usa o IP do cliente para buscar geolocalização
        const ipResponse = await axios.get(`https://ipapi.co/${clientIP}/json/`);
        const ipData = ipResponse.data;

        console.log('📡 Resposta da API de IP:', ipData);

        if (ipData.latitude && ipData.longitude) {
          userLat = parseFloat(ipData.latitude);
          userLon = parseFloat(ipData.longitude);
          console.log('✅ Coordenadas usuário via IP:', { userLat, userLon, cidade: ipData.city, regiao: ipData.region });
        } else {
          console.log('❌ API não retornou coordenadas. Dados:', ipData);
          return res.status(400).json({ erro: 'Não foi possível obter localização via IP' });
        }
      } catch (ipErr) {
        console.error('❌ Erro ao buscar IP:', ipErr.message);
        return res.status(400).json({ erro: 'Erro ao obter localização via IP: ' + ipErr.message });
      }
    }

    // Valida coordenadas do usuário
    if (isNaN(userLat) || isNaN(userLon)) {
      console.log('❌ Coordenadas do usuário inválidas:', { userLat, userLon });
      return res.status(400).json({ erro: 'Coordenadas inválidas' });
    }

    // Busca totens no banco
    console.log('🔎 Buscando totens no banco de dados...');
    pool.query(`
      SELECT t.numMac, e.cep, e.lat, e.lon
      FROM totem t
      INNER JOIN endereco e ON t.fkEndereco = e.idEndereco
    `, async (err, totens) => {
      if (err) {
        console.error('❌ Erro na query:', err.message);
        return res.status(500).json({ erro: err.message });
      }

      console.log(`📦 ${totens.length} totens encontrados no banco`);

      if (totens.length === 0) {
        return res.status(404).json({ erro: 'Nenhum totem cadastrado' });
      }

      // Processa cada totem
      const totensWithDist = await Promise.all(totens.map(async (totem) => {
        let lat = totem.lat;
        let lon = totem.lon;

        // Converte para número se vier como string do banco
        if (typeof lat === 'string') lat = parseFloat(lat);
        if (typeof lon === 'string') lon = parseFloat(lon);

        // Se não tem coordenadas, busca pela API do CEP
        if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
          console.log(`🔄 Totem ${totem.numMac} sem coordenadas, buscando CEP ${totem.cep}...`);

          try {
            const cep = totem.cep.replace(/\D/g, '');

            // Tenta AwesomeAPI primeiro (mais confiável para coordenadas)
            let response = await axios.get(`https://cep.awesomeapi.com.br/json/${cep}`);
            let data = response.data;

            if (response.status === 200 && data.lat && data.lng) {
              console.log(`✅ AwesomeAPI retornou coordenadas para ${totem.cep}`);
              lat = parseFloat(data.lat);
              lon = parseFloat(data.lng);
            } else {
              // Fallback: BrasilAPI
              console.log(`⚠️ AwesomeAPI falhou, tentando BrasilAPI...`);
              response = await axios.get(`https://brasilapi.com.br/api/cep/v2/${cep}`);
              data = response.data;

              if (response.status === 200 && data.location && data.location.coordinates &&
                data.location.coordinates.latitude && data.location.coordinates.longitude) {
                lat = parseFloat(data.location.coordinates.latitude);
                lon = parseFloat(data.location.coordinates.longitude);
                console.log(`✅ BrasilAPI retornou coordenadas para ${totem.cep}`);
              } else {
                console.warn(`⚠️ Nenhuma API retornou coordenadas para CEP ${totem.cep}`);
                return null;
              }
            }

            // Valida coordenadas antes de salvar
            if (!isNaN(lat) && !isNaN(lon) && lat !== 0 && lon !== 0) {
              console.log(`✅ Coordenadas válidas para ${totem.cep}: lat=${lat}, lon=${lon}`);

              // Salva no banco (converte para string se a coluna é VARCHAR)
              pool.query(
                'UPDATE endereco SET lat = ?, lon = ? WHERE cep = ?',
                [lat.toString(), lon.toString(), totem.cep],
                (updateErr) => {
                  if (updateErr) {
                    console.error(`❌ Erro ao atualizar coordenadas do CEP ${totem.cep}:`, updateErr.message);
                  } else {
                    console.log(`💾 Coordenadas salvas no banco para CEP ${totem.cep}`);
                  }
                }
              );
            } else {
              console.warn(`⚠️ Coordenadas inválidas: lat=${lat}, lon=${lon}`);
              return null;
            }
          } catch (apiErr) {
            console.error(`❌ Erro ao buscar CEP ${totem.cep}:`, apiErr.message);
            return null;
          }
        }

        // Validação final
        if (isNaN(lat) || isNaN(lon)) {
          console.warn(`⚠️ Totem ${totem.numMac} ignorado (coordenadas inválidas)`);
          return null;
        }

        // Calcula distância
        const dist = haversineDistance(userLat, userLon, lat, lon);
        console.log(`📏 Totem ${totem.numMac}: ${dist.toFixed(2)} km`);

        return { macTotem: totem.numMac, distanciaKm: dist };
      }));

      // Filtra totens válidos
      const filteredTotens = totensWithDist.filter(t => t !== null);

      console.log(`✅ ${filteredTotens.length} totens com coordenadas válidas`);

      if (filteredTotens.length === 0) {
        return res.status(404).json({ erro: 'Nenhum totem encontrado com coordenadas válidas' });
      }

      // Encontra o mais próximo
      const nearest = filteredTotens.reduce(
        (min, curr) => curr.distanciaKm < min.distanciaKm ? curr : min,
        { distanciaKm: Infinity }
      );

      console.log(`🎯 Totem mais próximo: ${nearest.macTotem} (${nearest.distanciaKm.toFixed(2)} km)`);

      res.json(nearest);
    });

  } catch (err) {
    console.error('❌ Erro geral:', err.message);
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

// Nova rota: Busca todos os totens com coordenadas para o heatmap
// Modifique de GET para POST para aceitar parâmetros
router.post("/heatmap-totens", async (req, res) => {
  console.log('🗺️ Requisição para heatmap de totens');
  
  const { regiao, idEmpresa } = req.body;
  console.log('Filtros recebidos:', { regiao, idEmpresa });

  try {
    // Query base
    let query = `
      SELECT t.numMac, t.fkModelo, e.cep, e.lat, e.lon, e.logradouro, e.cidade, e.uf,
             r.nome as nomeRegiao, r.sigla as siglaRegiao
      FROM totem t
      INNER JOIN endereco e ON t.fkEndereco = e.idEndereco
      LEFT JOIN zona z ON e.fkZona = z.idZona
      LEFT JOIN regiao r ON z.fkRegiao = r.idRegiao
      WHERE 1=1
    `;
    
    const params = [];
    
    // Adiciona filtro de região se fornecido
    if (regiao) {
      query += ` AND r.nome = ?`;
      params.push(regiao);
    }
    
    // Adiciona filtro de empresa se fornecido
    if (idEmpresa) {
      query += ` AND t.fkEmpresa = ?`;
      params.push(idEmpresa);
    }

    console.log('📊 Query:', query);
    console.log('📊 Params:', params);

    pool.query(query, params, async (err, totens) => {
      if (err) {
        console.error('❌ Erro na query:', err.message);
        return res.status(500).json({ erro: err.message });
      }

      console.log(`📦 ${totens.length} totens encontrados para heatmap`);

      // Processa cada totem para garantir que tem coordenadas
      const totensComCoordenadas = await Promise.all(totens.map(async (totem) => {
        let lat = totem.lat;
        let lon = totem.lon;

        // Converte para número se vier como string do banco
        if (typeof lat === 'string') lat = parseFloat(lat);
        if (typeof lon === 'string') lon = parseFloat(lon);

        // Se não tem coordenadas, busca pela API do CEP
        if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
          console.log(`🔄 Buscando coordenadas para totem ${totem.numMac} (CEP: ${totem.cep})`);

          try {
            const cep = totem.cep.replace(/\D/g, '');

            // Tenta AwesomeAPI primeiro
            let response = await axios.get(`https://cep.awesomeapi.com.br/json/${cep}`);
            let data = response.data;

            if (response.status === 200 && data.lat && data.lng) {
              lat = parseFloat(data.lat);
              lon = parseFloat(data.lng);

              // Salva no banco para próximas consultas
              pool.query(
                'UPDATE endereco SET lat = ?, lon = ? WHERE cep = ?',
                [lat.toString(), lon.toString(), totem.cep],
                (updateErr) => {
                  if (updateErr) console.error(`❌ Erro ao atualizar ${totem.cep}`);
                }
              );
            } else {
              // Fallback: BrasilAPI
              response = await axios.get(`https://brasilapi.com.br/api/cep/v2/${cep}`);
              data = response.data;

              if (response.status === 200 && data.location && data.location.coordinates &&
                data.location.coordinates.latitude && data.location.coordinates.longitude) {
                lat = parseFloat(data.location.coordinates.latitude);
                lon = parseFloat(data.location.coordinates.longitude);

                pool.query(
                  'UPDATE endereco SET lat = ?, lon = ? WHERE cep = ?',
                  [lat.toString(), lon.toString(), totem.cep],
                  (updateErr) => {
                    if (updateErr) console.error(`❌ Erro ao atualizar ${totem.cep}`);
                  }
                );
              }
            }
          } catch (apiErr) {
            console.error(`❌ Erro ao buscar CEP ${totem.cep}:`, apiErr.message);
            return null;
          }
        }

        // Validação final
        if (isNaN(lat) || isNaN(lon)) {
          console.warn(`⚠️ Totem ${totem.numMac} sem coordenadas válidas - ignorado`);
          return null;
        }

        return {
          mac: totem.numMac,
          lat: lat,
          lon: lon,
          cep: totem.cep,
          endereco: `${totem.logradouro}, ${totem.cidade} - ${totem.uf}`,
          modelo: totem.fkModelo,
          regiao: totem.nomeRegiao,
          siglaRegiao: totem.siglaRegiao
        };
      }));

      // Filtra totens válidos
      const totensValidos = totensComCoordenadas.filter(t => t !== null);

      console.log(`✅ ${totensValidos.length} totens com coordenadas válidas`);

      res.json({
        totens: totensValidos,
        total: totensValidos.length
      });
    });

  } catch (err) {
    console.error('❌ Erro geral:', err.message);
    res.status(500).json({ erro: 'Erro ao buscar totens para heatmap: ' + err.message });
  }
});

module.exports = router;