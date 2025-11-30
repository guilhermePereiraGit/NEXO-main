window.onload = async function () {
    await carregarDadosDoTotem();
};

async function carregarJson(diretorio, mac, dia, arquivo) {
    var resposta = await fetch(`/s3Route/${diretorio}/${mac}/${dia}/${arquivo}`);
    var dados = await resposta.json();
    console.log(dados);
    return dados;
}

async function buscarParametrosTotem(nomeModelo, idEmpresa) {
    try {
        const response = await fetch(`/totem/parametrosTotem?nomeModelo=${nomeModelo}&idEmpresa=${idEmpresa}`);
        if (!response.ok) throw new Error(`Erro ao buscar parâmetros: ${response.status}`);
        return await response.json();
    } catch (erro) {
        console.error('Erro ao buscar parâmetros do totem:', erro);
        return null;
    }
}

async function buscarInfoTotem(mac) {
    try {
        const response = await fetch(`/totem/infoTotem?numMAC=${mac}`);
        if (!response.ok) throw new Error(`Erro ao buscar informações: ${response.status}`);
        return await response.json();
    } catch (erro) {
        console.error('Erro ao buscar informações do totem:', erro);
        return null;
    }
}

async function buscarTicketPorMAC(mac) {
    try {
        const response = await fetch(`/jira/buscarTicketPorMAC?mac=${mac}`);
        if (!response.ok) throw new Error(`Erro ao buscar ticket: ${response.status}`);
        return await response.json();
    } catch (erro) {
        console.error('Erro ao buscar ticket do Jira:', erro);
        return null;
    }
}

function preencherInfoTotem(totem) {
    if (!totem) return;

    const t = totem[0];

    console.log("Preenchendo informações do totem:", t);

    document.querySelector('#idTotem').textContent   = t.idTotem;
    document.querySelector('#Mac p').textContent     = t.numMAC;
    document.querySelector('#modelo p').textContent  = t.modelo;
    document.querySelector('#status p').textContent  = t.status;
    document.querySelector('#cep p').textContent     = t.cep;
    document.querySelector('#cidade p').textContent  = t.cidade;
    document.querySelector('#bairro p').textContent  = t.bairro;
    document.querySelector('#rua p').textContent     = t.rua;
    document.querySelector('#numero p').textContent  = t.numero;

    sessionStorage.MODELOTOTEM = t.modelo;
    sessionStorage.IDEMPRESA = t.fkEmpresa;

    console.log("Id da empresa no objeto totem:", t.fkEmpresa);
    console.log("Id da empresa armazenado na sessionStorage:", sessionStorage.IDEMPRESA);
}

function preencherTicket(ticket) {
    if (ticket) {
        console.log("Nenhum ticket encontrado para o MAC fornecido.");
        document.getElementById('grauAlerta').textContent = "Nenhum alerta";
        document.getElementById('alerta').style.borderLeftColor = 'var(--bem)';
        document.getElementById('parametros').textContent = "Totem operando dentro dos parâmetros normais";
        return;
    };

    const descricao = ticket.fields.description.content[0].content[0].text;

    const indexParametros = descricao.indexOf('Parâmetros ultrapassados: ');
    if (indexParametros !== -1) {
        document.getElementById('parametros').textContent = "Causas: " + descricao.substring(indexParametros + 25).trim();
    }

    const indexNivel = descricao.indexOf('Nível do alerta: ');
    if (indexNivel !== -1) {
        const criticidade = descricao.substring(indexNivel + 16).trim();
        document.getElementById('grauAlerta').textContent = criticidade;

        if (criticidade === 'Muito Perigoso') {
            document.getElementById('alerta').style.borderLeftColor = 'var(--mperigo)';
        } else if (criticidade === 'Atenção') {
            document.getElementById('alerta').style.borderLeftColor = 'var(--atencao)';
        } else if (criticidade === 'Perigoso') {
            document.getElementById('alerta').style.borderLeftColor = 'var(--perigo)';
        }
    }
}

function preencherDadosBucket(jsonDados) {
    
}

async function carregarDadosDoTotem() {
    const mac = 149397958151314;
    console.log("Carregando dados do totem:", mac);

    const infoTotem = await buscarInfoTotem(mac);
    const ticket = await buscarTicketPorMAC(mac);

    preencherInfoTotem(infoTotem);
    preencherTicket(ticket);
    carregarDashboard(mac, sessionStorage.MODELOTOTEM, sessionStorage.IDEMPRESA);

    diaAtual = "2025-11-19";
    dados = await carregarJson('33', '271371670400310', diaAtual, "dados.json");

    console.log("Dados carregados com sucesso!");
}

async function carregarDashboard(mac, modelo, idEmpresa) {
    const ctx = document.getElementById("graficoComponente");

    const parametros = await buscarParametrosTotem(modelo, idEmpresa);

    document.querySelector('#limiteProcessos').textContent  = parametros[3].limiteMax;

    console.log("Parâmetros recebidos do backend:", parametros);

    if (!parametros) {
        console.error("Não foi possível carregar os limites do backend.");
    }

    const limitesAlerta = {
        cpu: parametros[0].limiteMax,
        ram: parametros[1].limiteMax,
        disco: parametros[2].limiteMax
    };

    console.log("Limites recebidos:", limitesAlerta);

    // --- 2. Definir dados mockados do gráfico (ou vindo do backend futuramente) ---
    let dadosComponentes = {
        cpu: [12, 25, 18, 40, 32, 60],
        ram: [50, 48, 52, 60, 63, 70],
        disco: [30, 35, 45, 28, 22, 18]
    };

    // --- 3. Criar gráfico inicial ---
    const componenteInicial = document.getElementById("componentSelect").value;
    let chart = gerarGraficoComponente(ctx, componenteInicial, dadosComponentes, limitesAlerta);

    // --- 4. Atualizar gráfico quando o select mudar ---
    document.getElementById("componentSelect").addEventListener("change", e => {
        const comp = e.target.value;

        chart.destroy();
        chart = gerarGraficoComponente(ctx, comp, dadosComponentes, limitesAlerta);
    });
}


function gerarGraficoComponente(ctx, componente, dadosComponentes, limitesAlerta) {

    return new Chart(ctx, {
        type: "line",
        data: {
            labels: ["20h", "16h", "12h", "8h", "4h", "0h"],
            datasets: [
                {
                    label: componente.toUpperCase(),
                    borderWidth: 3,
                    borderColor: "#6c4cff",
                    backgroundColor: "#6c4cff55",
                    data: dadosComponentes[componente]
                },
                {
                    label: `Limite de Alerta (${limitesAlerta[componente]}%)`,
                    data: Array(6).fill(limitesAlerta[componente]),
                    borderColor: "#ff0000",
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    tension: 0
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
}


document.getElementById("componentSelect").addEventListener("change", e => {
    const comp = e.target.value;

    chart.data.datasets[0].data = dadosComponentes[comp];
    chart.data.datasets[0].label = comp.toUpperCase();

    chart.data.datasets[1].data = Array(6).fill(limitesAlerta[comp]);
    chart.data.datasets[1].label = `Limite de Alerta (${limitesAlerta[comp]}%)`;

    chart.update();
});

function abrirMenu() {
    menu_icon = document.getElementById('icone');
    menu = document.querySelector('.menu-extend');
    if (menu_icon.classList.contains("bi-list")) {
        console.log("entrei");
        document.getElementById('extend').style.display = "flex";
        menu.style.animation = "expandirDireita 0.5s ease forwards";
        menu_icon.classList.remove("bi-list");
        menu_icon.classList.add("bi-x-lg")

    } else {
        menu.style.animation = "recolherEsquerda 0.5s ease forwards";
        menu_icon.classList.remove("bi-x-lg");
        menu_icon.classList.add("bi-list")
    }
}

function ativarPopup() {
    popup = $("#popup-logout");
    popup.css({ display: "flex", opacity: 0, "pointer-events": "auto" }).animate({ opacity: 1 }, 300);
}
function fecharPopup() {
    popup = $("#popup-logout");
    popup.css({ display: "flex", opacity: 0, "pointer-events": "none" }).animate({ opacity: 0 }, 300);
}