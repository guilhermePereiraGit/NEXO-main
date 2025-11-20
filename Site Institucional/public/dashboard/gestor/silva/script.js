//Chamar Funções de Carregamento de Dados
window.onload = function() {
    carregarDados();
};

//Chamar Função de Plotar Gráficos (Detalhe, usando o método de EventListener para aguardar surgir
//o canvas corretamente para plotar)
window.addEventListener("load", () => {
        gerarGraficoPizza();
        gerarGraficoLinha();
});

function gerarGraficoPizza() {
    const barra = document.getElementById('grafico-pizza');
    new Chart(barra, {
        type: 'doughnut',
        data: {
            labels: ['Alertas', 'Totens'],
            datasets: [{
                data: [400, 1000],
                backgroundColor: ["#451c8b","#c8c1ff"]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
            }
        },
    });
}

function gerarGraficoLinha() {
    const linha = document.getElementById('grafico-linha');
    new Chart(linha, {
        type: 'line',
        data: {
            labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
            datasets: [
                {
                    label: 'Tempo Downtime',
                    data: [10, 15, 5, 10, 13, 20, 15],
                    borderColor: '#451c8bd6',
                    backgroundColor: '#451c8b6c',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: false                
                }
            }
        },
    });
}
function escolherRegiao(regiao, sigla) {
    sessionStorage.setItem('REGIAO_ESCOLHIDA', regiao);
    sessionStorage.setItem('SIGLA_REGIAO', sigla);
    fecharEscolha();
    carregarDados();
    gerarGraficoLinha();
}

function carregarDados() {
    regiao_escolhida = document.getElementById('regiao-escolhida');
    sigla_escolhida = document.getElementById('sigla-regiao');

    if (sessionStorage.getItem('REGIAO_ESCOLHIDA')) {
        regiao_escolhida.innerHTML = sessionStorage.getItem('REGIAO_ESCOLHIDA');
        sigla_escolhida.innerHTML = sessionStorage.getItem('SIGLA_REGIAO');
        document.getElementById('waiting').style.display = 'none';
        document.getElementById('conteudo').style.display = 'block';
        document.getElementById('escolhaNew').style.display = 'block';
        document.getElementById('eficiencia').style.display = 'block';
        document.getElementById('alertas').style.display = 'block';
        
    } else {
        regiao_escolhida.innerHTML = "Região não Selecionada";
        sigla_escolhida.innerHTML = "Clique em <i class='bi bi-arrow-repeat' style='cursor: pointer;' onclick=\"abrirEscolha()\"></i> para Selecionar uma Região";
        document.getElementById('escolhaNew').style.display = 'none';
        document.getElementById('conteudo').style.display = 'none';
        document.getElementById('eficiencia').style.display = 'none';
        document.getElementById('alertas').style.display = 'none';
    }
}

function carregarRegioes() {
    escolha = document.getElementById('estado-escolha').value;
    regioes = document.getElementById('regioes');
    producao = document.getElementById('producao');
    aguardando = document.getElementById('aguardando');
    priorizar = document.getElementById('priorizar');
    if (escolha == "x") {
        aguardando.style.display = 'flex';
        regioes.style.display = 'none';
        producao.style.display = 'none';
        priorizar.style.display = 'none';
    } else if (escolha == "SP") {
        aguardando.style.display = 'none';
        regioes.style.display = 'flex';
        producao.style.display = 'none';
        priorizar.style.display = 'flex';
    } else {
        aguardando.style.display = 'none';
        regioes.style.display = 'none';
        producao.style.display = 'flex';
        priorizar.style.display = 'none';
    }
}

function ativar(escolha) {
    document.getElementById(escolha).style.display = 'block';
    document.getElementById(escolha).style.animation = 'expandirEsquerda 0.5s ease forwards';
    if (escolha == "fundo") {
        document.getElementById('fundo2').style.animation = 'recolherDireita 0.5s ease forwards';
        document.getElementById('first').style.color = "#451c8b";
        document.getElementById('second').style.color = "white";
        document.getElementById('third').style.color = "white";
    } else if (escolha == "fundo2") {
        document.getElementById('fundo').style.animation = 'recolherDireita 0.5s ease forwards';
        document.getElementById('second').style.color = "#451c8b";
        document.getElementById('first').style.color = "white";
        document.getElementById('third').style.color = "white";
    }
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
function abrirPassos() {
    popup = $("#popup-passos");
    popup.css({ display: "flex", opacity: 0, "pointer-events": "auto" }).animate({ opacity: 1 }, 300);
}
function fecharPassos() {
    popup = $("#popup-passos");
    popup.css({ display: "flex", opacity: 0, "pointer-events": "none" }).animate({ opacity: 0 }, 300);
}