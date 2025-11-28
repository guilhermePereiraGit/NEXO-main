require('dotenv').config({ path: '.env.dev' });
async function visualizarChamadosJira(req, res) {

    /*Pegando variaveis do Env.dev*/
    const token = process.env.JIRA_API_TOKEN;
    const email = process.env.JIRA_EMAIL;
    const url = process.env.JIRA_URL;

    /*Email do tecnico*/
    const emailTecnico = req.query.EMAIL_USUARIO;

    const data = new Date().toISOString().split("T")[0];
    const jql = `assignee = "${emailTecnico}" AND created >= "${data} 00:00" AND created <= "${data} 23:59"`;
    const auth = Buffer.from(`${email}:${token}`).toString("base64");

    fetch(url + `?jql=${encodeURIComponent(jql)}&fields=summary,status,created`, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Accept': 'application/json'
        }
    })
        .then(resposta => resposta.json())
        .then(dados => {
            console.log("Chamados:", dados);
            res.json(dados);
        })
        .catch(erro => console.error("Erro ao procurar chamados (JIRA CONTROLLER):", erro));

}
function buscarInfosTotem() {


}
module.exports = visualizarChamadosJira;