const ctx = document.getElementById("graficoComponente");
const componenteInicial = document.getElementById("componentSelect").value;

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