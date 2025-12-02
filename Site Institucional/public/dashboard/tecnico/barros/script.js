window.onload = async function () {
    await carregarDadosDoTotem();
};

async function carregarDadosDoTotem() {
    const mac = sessionStorage.MAC_TOTEM;
    const empresa = sessionStorage.ID_EMPRESA;
    
    console.log("Carregando dados do totem:", mac, empresa);

    const dados = await carregarJson(empresa, mac, "dados.json");
    const infoTotem = await buscarInfoTotem(mac);
    const ticket = await buscarTicketPorMAC(mac);

    preencherDadosBucket(dados);
    preencherInfoTotem(infoTotem);

    const modelo = sessionStorage.MODELOTOTEM;

    preencherTicket(ticket);
    carregarDashboard(modelo, empresa);

    console.log("Dados carregados com sucesso!");
}

async function carregarJson(diretorio, mac, arquivo) {
    var resposta = await fetch(`/s3Route/${diretorio}/${mac}/${arquivo}`);
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
        const response = await fetch(`/jiraBarros/buscarTicketPorMAC?mac=${mac}`);
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

    document.querySelector('#idTotem').innerHTML = t.idTotem;
    document.querySelector('#Mac p').innerHTML = t.numMAC;
    document.querySelector('#modelo p').innerHTML = t.modelo;
    document.querySelector('#status p').innerHTML = t.status;
    document.querySelector('#cep p').innerHTML = t.cep;
    document.querySelector('#cidade p').innerHTML = t.cidade;
    document.querySelector('#bairro p').innerHTML = t.bairro;
    document.querySelector('#rua p').innerHTML = t.rua;
    document.querySelector('#numero p').innerHTML = t.numero;

    document.getElementById('nomeUsuario').innerHTML = sessionStorage.NOME_USUARIO;
    sessionStorage.MODELOTOTEM = t.modelo;

    console.log("Id da empresa no objeto totem:", t.fkEmpresa);
    console.log("Id da empresa armazenado na sessionStorage:", sessionStorage.IDEMPRESA);
}

function preencherTicket(ticket) {
    if (!ticket) {
        console.log("Nenhum ticket encontrado para o MAC fornecido.");
        document.getElementById('grauAlerta').innerHTML = "Nenhum alerta";
        document.getElementById('alerta').style.borderLeftColor = 'var(--bem)';
        document.getElementById('parametros').innerHTML = "Totem operando dentro dos parâmetros normais";
        return;
    };

    const descricao = ticket.fields.description.content[0].content[0].text;

    const indexParametros = descricao.indexOf('Parâmetros ultrapassados: ');
    if (indexParametros !== -1) {
        document.getElementById('parametros').innerHTML = "Causas: " + descricao.substring(indexParametros + 25).trim();
    }

    const indexNivel = descricao.indexOf('Nível do alerta: ');
    if (indexNivel !== -1) {
        const criticidade = descricao.substring(indexNivel + 16).trim();
        document.getElementById('grauAlerta').innerHTML = criticidade;

        if (criticidade == 'Muito Perigoso') {
            document.getElementById('alerta').style.borderLeftColor = 'var(--mperigo)';
        } else if (criticidade == 'Atenção') {
            document.getElementById('alerta').style.borderLeftColor = 'var(--atencao)';
        } else if (criticidade == 'Perigoso') {
            document.getElementById('alerta').style.borderLeftColor = 'var(--perigo)';
        }
    }
}

dadosGrafico = [];
labelsGrafico = [];
function preencherDadosBucket(jsonDados) {
    if (!jsonDados) {
        console.log("Nenhum dado encontrado no bucket.");
        return;
    };

    console.log("Preenchendo dados do bucket com:", jsonDados);

    dadosCpu = [];
    dadosRam = [];
    dadosDisco = [];

    const dados = jsonDados;
    console.log("Preenchendo dados do bucket:", dados);

    top5Processos = [];
    stringDiaHora = "";
    qtdProcessosAtivos = 0;
    for (i = 0; i < dados.janelas4h.length; i++) {
        if (dados.janelas4h[i].cpuMedia !== null &&
            dados.janelas4h[i].ramMedia !== null &&
            dados.janelas4h[i].discoMedia !== null &&
            dados.janelas4h[i].cpuMedia == 0 &&
            dados.janelas4h[i].ramMedia == 0 &&
            dados.janelas4h[i].discoMedia == 0) {
            console.log(`Fim do loop ${i}:`, dados.janelas4h[i]);
            break;
        }

        dadosCpu.push(dados.janelas4h[i].cpuMedia);
        dadosRam.push(dados.janelas4h[i].ramMedia);
        dadosDisco.push(dados.janelas4h[i].discoMedia);
        labelsGrafico.push(dados.janelas4h[i].horaInicio);

        dias = dados.janelas4h[i].uptime / 24;
        diasInteiros = Math.floor(dias);
        horas = (dias - diasInteiros) * 24;
        horasInteiras = Math.floor(horas);
        stringDiaHora = `${diasInteiros}d ${horasInteiras}h`;

        qtdProcessosAtivos = dados.janelas4h[i].qtdProcessos;

        top5Processos = dados.janelas4h[i].processos;

        console.log(`Dados na iteração ${i}: CPU=${dados.janelas4h[i].cpuMedia}, RAM=${dados.janelas4h[i].ramMedia}, Disco=${dados.janelas4h[i].discoMedia}`);
    }
    document.getElementById('valor-uptime').innerHTML = stringDiaHora;
    document.getElementById('valorAtivos').innerHTML = qtdProcessosAtivos;

    processosAtivos = document.getElementById('processosAtivos');

    console.log("Top 5 processos ativos:", top5Processos);

    for (i = 0; i < top5Processos.length; i++) {
        processosAtivos.innerHTML += `
        <tr>
            <td>${top5Processos[i].nome}</td>
            <td>${top5Processos[i].cpu}%</td>
            <td>${top5Processos[i].ram}%</td>
        </tr>
        `;
    }

    dadosGrafico = {
        cpu: dadosCpu,
        ram: dadosRam,
        disco: dadosDisco
    };
}

async function carregarDashboard(modelo, idEmpresa) {
    const ctx = document.getElementById("graficoComponente");

    const parametros = await buscarParametrosTotem(modelo, idEmpresa);

    document.querySelector('#limiteProcessos').innerHTML = parametros[3].limiteMax;

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
        cpu: dadosGrafico.cpu,
        ram: dadosGrafico.ram,
        disco: dadosGrafico.disco
    };

    console.log("Dados dos componentes para o gráfico:", dadosComponentes);

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
            labels: [labelsGrafico],
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
                    tension: 0,
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    max: 100,
                    title: {
                        display: true,
                        text: "Utilização (%)",
                        font: {
                            size: 14,
                            weight: "bold"
                        }
                    }
                },
                x: {
                    max: 7,
                    title: {
                        display: true,
                        text: "Horas passadas desde a captura",
                        font: {
                            size: 14,
                            weight: "bold"
                        }
                    }
                }
            },
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