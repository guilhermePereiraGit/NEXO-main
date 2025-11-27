// Função para buscar informações do totem
async function buscarInfoTotem(numMAC) {
    try {
        const response = await fetch('/totem/infoTotem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ numMACServer: numMAC })
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar informações: ${response.status}`);
        }

        const dados = await response.json();
        
        if (dados && dados.length > 0) {
            const totem = dados[0];
            
            // Preenchendo os dados no HTML usando os IDs
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

// Chamar a função ao carregar a página com um MAC de exemplo
// Substitua '1547240279279939' pelo MAC real do totem
window.addEventListener('load', function() {
    const macDoTotem = sessionStorage.MAC_TOTEM
    console.log('MAC encontrado:', macDoTotem)
    buscarInfoTotem(macDoTotem)
});

const ctx = document.getElementById("graficoComponente")
const componenteInicial = document.getElementById("componentSelect").value

let dadosComponentes = {
    cpu: [12, 25, 18, 40, 32, 60],
    ram: [50, 48, 52, 60, 63, 70],
    disco: [30, 35, 45, 28, 22, 18]
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
        }]
    },
    options: { responsive: true }
});

document.getElementById("componentSelect").addEventListener("change", e => {
    const comp = e.target.value;

    chart.data.datasets[0].data = dadosComponentes[comp];
    chart.data.datasets[0].label = comp.toUpperCase();
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