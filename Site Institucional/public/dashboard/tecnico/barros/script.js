// Função para buscar informações do totem
async function buscarInfoTotem(numMAC) {
    try {
        const response = await fetch(`/totem/infoTotem?numMAC=${numMAC}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar informações: ${response.status}`);
        }

        const dados = await response.json();

        if (dados && dados.length > 0) {
            const totem = dados[0];

            // Preenchendo os dados no HTML usando os IDs
            document.querySelector('#idTotem').textContent = totem.idTotem || '-';
            document.querySelector('#Mac p').textContent = totem.numMAC || '-';
            document.querySelector('#modelo p').textContent = totem.modelo || '-';
            document.querySelector('#status p').textContent = totem.status || '-';
            document.querySelector('#cep p').textContent = totem.cep || '-';
            document.querySelector('#cidade p').textContent = totem.cidade || '-';
            document.querySelector('#bairro p').textContent = totem.bairro || '-';
            document.querySelector('#rua p').textContent = totem.rua || '-';
            document.querySelector('#numero p').textContent = totem.numero || '-';

            console.log('Informações do totem carregadas com sucesso:', totem);
        } else {
            console.warn('Nenhum totem encontrado com este MAC');
        }
    } catch (erro) {
        console.error('Erro ao buscar informações do totem:', erro);
    }
}

window.addEventListener('load', function () {
    const macDoTotem = 149397958151314
    console.log('MAC encontrado:', macDoTotem)
    buscarInfoTotem(macDoTotem)
    buscarTicketPorMAC(macDoTotem)
    console.log('MAC enviado para buscar ticket:', macDoTotem)
});

async function buscarTicketPorMAC(mac) {
    try {
        const response = await fetch(`/jira/buscarTicketPorMAC?mac=${mac}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar ticket: ${response.status}`);
        }

        const ticket = await response.json();
        console.log('Ticket encontrado:', ticket);

        const descricao = ticket.fields.description.content[0].content[0].text;

        console.log('Descrição do ticket:', descricao);

        const index = descricao.indexOf('Parâmetros ultrapassados: ');
        if (index !== -1) {
            console.log('Parâmetros extraídos:', descricao.substring(index + 1).trim());
            document.getElementById('parametros').textContent = "Causas: " + descricao.substring(index + 25).trim();
        }

        const index2 = descricao.indexOf('Nível do alerta: ');
        const criticidade = "";
        if (index2 !== -1) {
            criticidade = descricao.substring(index2 + 16);
            console.log('Criticidade:', criticidade);
            document.getElementById('grauAlerta').textContent = criticidade;
        }

        return ticket;
    } catch (erro) {
        console.error('Erro ao buscar ticket do Jira:', erro);
        return null;
    }
}

const ctx = document.getElementById("graficoComponente")
const componenteInicial = document.getElementById("componentSelect").value

let dadosComponentes = {
    cpu: [12, 25, 18, 40, 32, 60],
    ram: [50, 48, 52, 60, 63, 70],
    disco: [30, 35, 45, 28, 22, 18]
};

// Limites de alerta para cada componente
const limitesAlerta = {
    cpu: 40,
    ram: 60,
    disco: 30
};

let chart = new Chart(ctx, {
    type: "line",
    data: {
        labels: ["0h", "4h", "8h", "12h", "16h", "20h"],
        datasets: [{
            label: componenteInicial,
            borderWidth: 3,
            borderColor: "#6c4cff",
            backgroundColor: "#6c4cff55",
            data: dadosComponentes.cpu
        },
        {
            // Linha de alerta
            label: "Limite de Alerta",
            data: Array(6).fill(limitesAlerta.cpu),
            borderColor: "#ff0000",
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 0,
            tension: 0
        }]
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

document.getElementById("componentSelect").addEventListener("change", e => {
    const comp = e.target.value;

    chart.data.datasets[0].data = dadosComponentes[comp];
    chart.data.datasets[0].label = comp.toUpperCase();

    // Atualiza a linha de alerta com o limite do componente selecionado
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

function abrirEscolha() {
    popup = $("#popup-escolha");
    popup.css({ display: "flex", opacity: 0, "pointer-events": "auto" }).animate({ opacity: 1 }, 300);
}
function fecharEscolha() {
    popup = $("#popup-escolha");
    popup.css({ display: "flex", opacity: 0, "pointer-events": "none" }).animate({ opacity: 0 }, 300);
}
function abrirPassos() {
    popup = $("#popup-passos");
    popup.css({ display: "flex", opacity: 0, "pointer-events": "auto" }).animate({ opacity: 1 }, 300);
}
function fecharPassos() {
    popup = $("#popup-passos");
    popup.css({ display: "flex", opacity: 0, "pointer-events": "none" }).animate({ opacity: 0 }, 300);
}