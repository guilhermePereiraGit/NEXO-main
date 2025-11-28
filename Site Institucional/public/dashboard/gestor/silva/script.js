//Chamar Funções de Carregamento de Dados
window.onload = function () {
    carregarDados();
    carregarDadosUser();
    carregarUltimos7Dias();
    carregarDowntime();
};

// CARREGAR ÚLTIMOS 7 DIAS
function carregarUltimos7Dias() {
    dataAtual = new Date();
    dataAtualFormatada = dataAtual.toLocaleDateString();

    //Conversão de milisegundos (Captura do Date) para dias
    seteDias = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    seteDiasFormatada = seteDias.toLocaleDateString();

    p_data = document.getElementById('p_data');
    p_data.innerHTML = `${seteDiasFormatada} à ${dataAtualFormatada}`;
}

//CARREGAR ARQUIVOS JSON
async function carregarJson(diretorio, arquivo) {
    var resposta = await fetch(`/s3Route/dados/${diretorio}/${arquivo}`);
    var dados = await resposta.json();
    console.log(dados);
    return dados;
}
// carregarJson(`empresa-${sessionStorage.getItem('ID_EMPRESA')}`, "downtime.json");
// carregarJson(`empresa-${sessionStorage.getItem('ID_EMPRESA')}`, "alertas.json");

async function carregarDowntime(){
    downtime_regiao = document.getElementById('downtime_regiao');
    var downtime = await carregarJson(`empresa-${sessionStorage.getItem('ID_EMPRESA')}`,"downtime.json");
    console.log(downtime);
    console.log('AAAAAAAAAAAA');
    
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
        carregarModelos();
        carregarTotens();
        gerarGraficoLinha();
        buscarComponentes();
    } else {
        regiao_escolhida.innerHTML = "Região não Selecionada";
        sigla_escolhida.innerHTML = "Clique em <i class='bi bi-arrow-repeat' style='cursor: pointer;' onclick=\"abrirEscolha()\"></i> para Selecionar uma Região";
        document.getElementById('escolhaNew').style.display = 'none';
        document.getElementById('conteudo').style.display = 'none';
        document.getElementById('eficiencia').style.display = 'none';
        document.getElementById('alertas').style.display = 'none';
    }
}

function buscarComponentes() {
    fetch("/gestor/buscarComponentes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then(function (resposta) {
            console.log("resposta: ", resposta);

            if (resposta.ok) {
                resposta.json().then(data => {
                    componentes = data;
                    console.log(componentes);
                    plotarModelosCriticos(componentes);
                });
            } else {
                console.log("Erro ao Pegar Modelos");

            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}

function plotarModelosCriticos(componentes) {

}

async function gerarGraficoPizza(totens) {
    var alertas = await carregarJson(`empresa-${sessionStorage.getItem('ID_EMPRESA')}`,"alertas.json");
    total_alertas_p = document.getElementById('total_alertas');
    total_alertas_p.innerHTML = alertas.length + " Alertas";
    console.log('alertas', alertas);
    console.log('totens',totens);
    


    const barra = document.getElementById('grafico-pizza');
    new Chart(barra, {
        type: 'doughnut',
        data: {
            labels: ['Alertas', 'Totens'],
            datasets: [{
                data: [alertas.length, totens],
                backgroundColor: ["#451c8b", "#c8c1ff"]
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
    carregarModelos();
    carregarTotens();
    fecharEscolha();
    window.location.reload();
    carregarDados();
    gerarGraficoLinha();
}

function carregarModelos() {
    fetch("/gestor/buscarModelos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then(function (resposta) {
            console.log("resposta: ", resposta);

            if (resposta.ok) {
                resposta.json().then(data => {
                    modelos = data;
                    console.log(modelos);
                    plotarModelos(modelos);
                });
            } else {
                console.log("Erro ao Pegar Modelos");

            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}

function plotarModelos(modelos) {
    div_modelos = document.getElementById('modelos');
    for (var i = 0; i < modelos.length; i++) {
        div_modelos.innerHTML += `
    <div class="modelo">
    <h2>Modelo ${modelos[i].NomeModelo}</h2>
    <div class="color"></div>
    </div>
    `;
    }
}

function carregarTotens() {
    nomeRegiao = sessionStorage.getItem('REGIAO_ESCOLHIDA');
    fetch("/gestor/buscarTotens", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nomeRegiao: nomeRegiao
        }),
    })
        .then(function (resposta) {
            console.log("resposta: ", resposta);
            if (resposta.ok) {
                resposta.json().then(data => {
                    totens = data;
                    console.log(totens);
                    plotarTotens(totens);
                    gerarGraficoPizza(totens.length);
                });
            } else {
                console.log("Erro ao Pegar Modelos");

            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}

function plotarTotens(totens) {
    p_totaltotens = document.getElementById('total_totens');
    p_totaltotens.innerHTML = `${totens.length} Totens`;
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


function carregarDadosUser() {
    document.getElementById('nome_user').innerHTML = sessionStorage.getItem('NOME_USUARIO')
}

// ESCOLHA DE REGIÃO
function abrirEscolha() {
    popup = $("#popup-escolha");
    popup.css({ display: "flex", opacity: 0, "pointer-events": "auto" }).animate({ opacity: 1 }, 300);
    carregarRegioesCadastradas();
}
function fecharEscolha() {
    popup = $("#popup-escolha");
    popup.css({ display: "flex", opacity: 0, "pointer-events": "none" }).animate({ opacity: 0 }, 300);
}

function carregarRegioesCadastradas() {
    emailUsuario = sessionStorage.getItem('EMAIL_USUARIO');

    fetch("/gestor/buscarRegioes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            emailUsuario: emailUsuario
        }),
    })
        .then(function (resposta) {
            console.log("resposta: ", resposta);

            if (resposta.ok) {
                resposta.json().then(data => {
                    regioes = data;
                    console.log(regioes);
                    plotarRegioes(regioes)

                });
            } else {
                console.log("Erro ao Pegar Regiões");

            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}

function plotarRegioes(regioes) {
    div_regioes = document.getElementById('regioes');
    div_regioes.innerHTML = ``;
    for (var i = 0; i < regioes.length; i++) {
        div_regioes.innerHTML += `
    <div class="regiao" onclick="escolherRegiao('${regioes[i].NomeRegiao}','${regioes[i].SiglaRegiao}')">
    <h1>${regioes[i].NomeRegiao} - ${regioes[i].SiglaRegiao}</h1>
    <div class="priorizar">
    <h2>Disponibilidade</h2>
    <h3>60%</h3>
    </div>
    </div>
    `;
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