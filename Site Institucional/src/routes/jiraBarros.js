var express = require("express");
var router = express.Router();
var https = require('https');

const EMAIL = "nexoadm9328@outlook.com";
const API_TOKEN = "ATATT3xFfGF0KAd4E36gpyLtB_q92dfFk2Ri6rKT5esDuFu5qIDnaMxPJcqwYdWd_yOgVqbKwcgiWxVEn7TldcHg3XWk6tKmnrMHXl6ZTTUoE5dZjRQ0R78earc8CMcw9lVZw2dmoQMvJoCqQIsAipKdwkDDb78_gk0jgriSi7mfie8LKW7580Q=0BCF64DE";
const BASE_URL = "https://nexoadm.atlassian.net/rest/api/3/search/jql";

function gerarAuthHeader() {
    const auth = `${EMAIL}:${API_TOKEN}`;
    const encoded = Buffer.from(auth).toString('base64');
    return `Basic ${encoded}`;
}

function fazerRequisicaoJira(url, headers) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers }, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    body: data
                });
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

router.get("/buscarTicketPorMAC", async function (req, res) {
    const macTotem = req.query.mac;
    
    if (!macTotem) {
        return res.status(400).json({ erro: "MAC não fornecido" });
    }

    try {
        // Busca por tickets em aberto que contêm o MAC no summary
        const jql = `project=NEXO AND status!=Done AND summary~'${macTotem}' ORDER BY created DESC`;
        
        const urlParams = new URLSearchParams();
        urlParams.append('jql', jql);
        urlParams.append('maxResults', '1');
        urlParams.append('fields', 'id,key,summary,description,status,created');

        const url = `${BASE_URL}?${urlParams.toString()}`;
        
        console.log("MAC recebido:", macTotem);
        console.log("Chamando Jira com JQL:", jql);
        console.log("URL Jira completa:", url);

        const headers = {
            "Authorization": gerarAuthHeader(),
            "Accept": "application/json",
            "User-Agent": "Node.js"
        };

        const resposta = await fazerRequisicaoJira(url, headers);
        
        console.log("STATUS HTTP:", resposta.status);
        console.log("Resposta completa:", resposta.body);

        if (resposta.status < 200 || resposta.status >= 300) {
            console.error("Erro na requisição Jira:", resposta.status);
            console.error("Detalhes do erro:", resposta.body);
            return res.status(500).json({ erro: "Erro ao buscar ticket no Jira", detalhes: resposta.body });
        }

        let json;
        try {
            json = JSON.parse(resposta.body);
        } catch (parseError) {
            console.error("Erro ao fazer parse JSON:", parseError);
            console.error("Resposta recebida:", resposta.body);
            return res.status(500).json({ erro: "Erro ao fazer parse da resposta Jira", detalhes: resposta.body });
        }

        console.log("JSON parseado com sucesso");
        console.log("Número de issues:", json.issues ? json.issues.length : "undefined");
        console.log("Issues array existe?", Array.isArray(json.issues));
        
        if (!json.issues || json.issues.length === 0) {
            console.warn("Nenhum ticket aberto encontrado para o MAC:", macTotem);
            console.log("Resposta Jira completa:", JSON.stringify(json, null, 2));
            return res.json(null);
        }

        console.log("Retornando primeiro issue:", JSON.stringify(json.issues[0], null, 2));
        return res.json(json.issues[0]);

    } catch (erro) {
        console.error("Erro ao buscar ticket no Jira:", erro);
        res.status(500).json({ erro: "Erro ao buscar ticket no Jira", detalhes: erro.message });
    }
});

module.exports = router;