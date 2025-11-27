const EMAIL = "nexoadm9328@outlook.com";
const API_TOKEN = "ATATT3xFfGF0_fVkaM5Ki2nmRvhG9-y55D_-ETUeF5czctbbxRWrzQA__d2yNb6oOvFExIIDY5LB4ApkNbtUpnvUulpgWkYdFAG5B-ta9pIXHwKkfpI3ByQ6tYh4wxdQn0YBX-FZwAnCLjcogHglpwg77aUvzpsEOHVxXUdFaryWjAf_q3Txtrw=6383D10F";
const BASE_URL = "https://nexoadm.atlassian.net/rest/api/3/search/jql";
const FIELDS = "id,key,summary,description,status,created";

function gerarAuthHeader() {
    const auth = `${EMAIL}:${API_TOKEN}`;
    const encoded = btoa(auth);
    return `Basic ${encoded}`;
}

async function buscarUltimoTicketAbertoPorMAC(macTotem) {
    try {
        const jql = `statusCategory != Done AND summary ~ "${macTotem}" ORDER BY created DESC`;
        
        const urlParams = new URLSearchParams();
        urlParams.append('jql', jql);
        urlParams.append('maxResults', '1');
        urlParams.append('fields', FIELDS);

        const url = `${BASE_URL}?${urlParams.toString()}`;
        
        console.log("URL Jira → ", url);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": gerarAuthHeader(),
                "Accept": "application/json"
            }
        });

        const status = response.status;
        console.log("STATUS HTTP Jira → " + status);

        if (status < 200 || status >= 300) {
            console.error("Erro na requisição Jira:", status);
            const errorText = await response.text();
            console.error("Detalhes do erro:", errorText);
            return null;
        }

        const json = await response.json();
        console.log("Resposta Jira → ", json);

        if (!json.issues || json.issues.length === 0) {
            console.warn("Nenhum ticket aberto encontrado para o MAC:", macTotem);
            return null;
        }

        return json.issues[0]; // retorna apenas o primeiro ticket

    } catch (erro) {
        console.error("Erro ao buscar ticket no Jira:", erro);
        return null;
    }
}
