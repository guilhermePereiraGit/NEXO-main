require('dotenv').config({ path: '.env.dev' });
async function visualizarChamadosJira(req, res) {

    /*Pegando variaveis do Env.dev*/
    const token = process.env.JIRA_API_TOKEN;
    const email = process.env.JIRA_EMAIL;
    const urlJiraNexo = process.env.JIRA_URL;

    /*Email do tecnico*/
    const emailTecnico = req.query.EMAIL_USUARIO;
    const urlBaseJira = "https://nexoadm.atlassian.net/rest/api/3";
    const urlBuscaEmailUsuario = `${urlBaseJira}/user/search?query=${emailTecnico}`;

    const auth = Buffer.from(`${email}:${token}`).toString("base64");

    const procurarUsuarioEmail = await fetch(
        `${urlBuscaEmailUsuario}`,
        {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'application/json'
            }
        }
    );

    const usuariosJira = await procurarUsuarioEmail.json();
    var usuario = null;

    if (!usuariosJira || usuariosJira.length == 0) {
        console.log("Usuário Jira inexistente")
        return res.status(404).json({ erro: "Usuário Jira não encontrado" });
    } else {
        usuario = usuariosJira[0].accountId;
    }

    const jql = `assignee = "${usuario}"`;
    const urlBuscaChamado = `${urlJiraNexo}?jql=${encodeURIComponent(
        jql)}&fields=summary,status`;

    fetch(urlBuscaChamado, {
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

module.exports = visualizarChamadosJira;