function gerarGraficoLinha() {
    const linha = document.getElementById('grafico-linha');
    new Chart(linha, {
        type: 'line',
        data: {
            labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
            datasets: [
                {
                    label: 'Atenção',
                    data: [10, 15, 5, 10, 13, 20, 15],
                    borderColor: '#fada64',
                    tension: 0.4
                },
                {
                    label: 'Perigoso',
                    data: [5, 2, 7, 12, 3, 6, 9],
                    borderColor: '#f98a25',
                    tension: 0.4
                },
                {
                    label: 'Crítico',
                    data: [1, 2, 1, 4, 2, 3, 1],
                    borderColor: '#ff3131',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Chart.js Line Chart'
                }
            }
        },
    });
}

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