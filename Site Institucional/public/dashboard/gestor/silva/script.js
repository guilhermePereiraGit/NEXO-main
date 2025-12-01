//Chamar Funções de Carregamento de Dados
window.onload = async function () {
    //Muito mais simples e reduz tempo de demora do await
    vmodelos = await verificarModelos();

    //Se a empresa não tiver modelos cadastrados ele exibe um popup de aviso
    if (vmodelos.length != 0) {
        document.getElementById('sem_modelos').style.display = 'none';
        var empresa = `${sessionStorage.getItem('FK_EMPRESA')}`;
        cacheAlertas = await carregarJson(empresa, "alertas.json");
        cacheDowntime = await carregarJson(empresa, "downtime.json");
        verificarModelos();
        carregarDados();
        carregarDadosUser();
        carregarUltimos7Dias();
        carregarDowntime();
        plotarSelecionarModeloLinha();
        escolherModeloLinha();
    } else {
        document.getElementById('sem_modelos').style.display = 'flex';
    }
};

vmodelos = [];
async function verificarModelos() {
    var fkEmpresa = sessionStorage.getItem('FK_EMPRESA');
    try {
        var dados = await fetch("/gestor/buscarModelosPorEmpresa", {method: "POST",headers: { "Content-Type": "application/json" },body: JSON.stringify({ fkEmpresa })});
        if (!dados.ok) {console.error("Erro ao Pegar Modelos");return [];}
        var infos = await dados.json();
        return infos;

    } catch (erro) {
        console.error("Erro na requisição:", erro);
        return [];
    }

}

//PARA VERIFICAR A REGIÃO MAIS CRÍTICA À SER ANALISADA
async function priorizarRegiao(regioes){
    var alertas = cacheAlertas;
    var bancoRegioesAlerta = [];    

    for(var i = 0; i < regioes.length; i++){
        var regiaoAtual = regioes[i].NomeRegiao;
        var totalAlertasRegiao = 0;
        
        //For dos alertas
        for(var j = 0; j < alertas.length; j++){
            if(alertas[j].regiao == regioes[i].NomeRegiao){
                totalAlertasRegiao++;
            }
        }
        objetoRegiao = {
            nomeRegiao:regiaoAtual,
            totalAlertas:totalAlertasRegiao
        }
        bancoRegioesAlerta.push(objetoRegiao);
    }

    var maiorAlertas = 0;
    var regiaoPriorizar = "";

    console.log(bancoRegioesAlerta);
    //For para ver a região com maior número de alertas   
    for(var i = 0; i < bancoRegioesAlerta.length; i++){        
        if(bancoRegioesAlerta[i].totalAlertas){
            maiorAlertas = bancoRegioesAlerta[i].totalAlertas;
            regiaoPriorizar = bancoRegioesAlerta[i].nomeRegiao;
        }
    }
    
    document.getElementById('p_priorizar_regiao').innerHTML = `
    A região mais crítica é ${regiaoPriorizar}
    `;
}

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

//PLOTAR MÉTRICAS, MODELOS E ALERTAS
async function plotarAlertasComponentes(componentes) {
    var alertas = cacheAlertas;

    lista_metricas = document.getElementById('list_metrica');
    for (var i = 0; i < componentes.length; i++) {
        var totalAlertasComponente = 0;

        //Carregar Total de Alertas para cada Componente
        for (var j = 0; j < alertas.length; j++) {
            if (componentes[i].nome == alertas[j].componente) {
                totalAlertasComponente++;
            }
        }

        if (i == 0) {
            lista_metricas.innerHTML += `
        <div class="div_item" id="hide_metrica_${i}">
        <div class="infos-metrica">
        <h1 style="font-size:30px">${componentes[i].nome}</h1>
        <p>Status <span>${componentes[i].status}</span></p>
        <p style="color: #451c8b;">Total de Alertas <span>${totalAlertasComponente}</span></p>
        </div>
        <i class="bi bi-arrow-right" onclick="passarComponente('hide_metrica_${i}',componentes.length)"></i>
        </div>
        `;
        } else {
            lista_metricas.innerHTML += `
        <div class="div_item" id="hide_metrica_${i}" style="display:none">
        <div class="infos-metrica">
        <h1 style="font-size:30px">${componentes[i].nome}</h1>
        <p>Status <span>${componentes[i].status}</span></p>
        <p style="color: #451c8b;">Total de Alertas <span>${totalAlertasComponente}</span></p>
        </div>
        <i class="bi bi-arrow-right" onclick="passarComponente('hide_metrica_${i}',componentes.length)"></i>
        </div>
        `;
        }
    }
}

var indiceComponenteAtual = 0;
function passarComponente(componenteAparecer, totalComponentes) {
    if (indiceComponenteAtual == totalComponentes - 1) {
        indiceComponenteAtual = 0;
    } else {
        indiceComponenteAtual++;

        for (var i = 0; i < totalComponentes; i++) {
            var atual = document.getElementById(`hide_metrica_${i}`);

            if (atual != componenteAparecer) {
                atual.style.display = "none";
            }
        }
    }
    document.getElementById(`hide_metrica_${indiceComponenteAtual}`).style.display = "flex";
}

//PLOTAR MODELOS NO SELECT DO GRÁFICO PRINCIPAL DE LINHAS
async function plotarSelecionarModeloLinha() {
    select_principal = document.getElementById('slt_modelos_downtime');

    var dados = await fetch("/gestor/buscarModelos", {method: "POST",headers: { "Content-Type": "application/json" },body: JSON.stringify({ fkEmpresa:sessionStorage.getItem('FK_EMPRESA')})});
    var modelos = await dados.json();

    for (var i = 0; i < modelos.length; i++) {
        select_principal.innerHTML += `<option value="${modelos[i].NomeModelo}">${modelos[i].NomeModelo}</option>`;
    }
}

var linha = null;
async function escolherModeloLinha() {
    var downtimes = cacheDowntime;
    var escolha = document.getElementById('slt_modelos_downtime').value;

    var downtimesModelo = [];
    for (var i = 0; i < downtimes.length; i++) {
        if (downtimes[i].modelo == escolha) {
            downtimesModelo.push((downtimes[i].downtime1Dia) * -1);
            downtimesModelo.push((downtimes[i].downtime2Dia) * -1);
            downtimesModelo.push((downtimes[i].downtime3Dia) * -1);
            downtimesModelo.push((downtimes[i].downtime4Dia) * -1);
            downtimesModelo.push((downtimes[i].downtime5Dia) * -1);
            downtimesModelo.push((downtimes[i].downtime6Dia) * -1);
            downtimesModelo.push((downtimes[i].downtime7Dia) * -1);
        }
    }

    if (escolha == "all") {
        if (linha != null) { linha.destroy(); }
        var downtimesRegiao = [];
        var dr1Dia = 0;
        var dr2Dia = 0;
        var dr3Dia = 0;
        var dr4Dia = 0;
        var dr5Dia = 0;
        var dr6Dia = 0;
        var dr7Dia = 0;

        for (var i = 0; i < downtimes.length; i++) {
            dr1Dia += downtimes[i].downtime1Dia * -1;
            dr2Dia += downtimes[i].downtime2Dia * -1;
            dr3Dia += downtimes[i].downtime3Dia * -1;
            dr4Dia += downtimes[i].downtime4Dia * -1;
            dr5Dia += downtimes[i].downtime5Dia * -1;
            dr6Dia += downtimes[i].downtime6Dia * -1;
            dr7Dia += downtimes[i].downtime7Dia * -1;
        }
        downtimesRegiao.push(dr1Dia);
        downtimesRegiao.push(dr2Dia);
        downtimesRegiao.push(dr3Dia);
        downtimesRegiao.push(dr4Dia);
        downtimesRegiao.push(dr5Dia);
        downtimesRegiao.push(dr6Dia);
        downtimesRegiao.push(dr7Dia);
        diasDowntime = converter7Dias();

        const ctx = document.getElementById("grafico-linha");
        linha = new Chart(ctx, {
            type: 'line',
            data: {
                labels: diasDowntime,
                datasets: [
                    {
                        label: 'Tempo Downtime',
                        data: downtimesRegiao.reverse(),
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

    } else {
        //Esse reverse é uma função padrão do js e serve literalemnte para inverter a ordem de um vetor
        gerarGraficoLinha(converter7Dias(), downtimesModelo.reverse());
    }
}

function converter7Dias() {
    var dataAtual = new Date;
    var ultimaSemana = [];
    for (var i = 0; i < 7; i++) {
        var dataI = new Date(dataAtual);
        dataI.setDate(dataAtual.getDate() - i);
        var diaSemana = dataI.toLocaleString("pt-BR", { weekday: "long" });
        diaSemana = diaSemana.replace("-feira", "");
        ultimaSemana.push(diaSemana);
    }
    return ultimaSemana.reverse();
}


function gerarGraficoLinha(dias7, downtimesModelo) {
    if (linha != null) {
        //esse destroy é uma função padrão do ChatJs para limpeza de gráfico
        //se alguém ficar curioso e quiser ver como usar também
        //https://www.chartjs.org/docs/latest/developers/api.html
        linha.destroy();
    }

    const ctx = document.getElementById("grafico-linha");
    linha = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dias7,
            datasets: [
                {
                    label: 'Tempo Downtime',
                    data: downtimesModelo,
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

//CARREGAR ARQUIVOS JSON
async function carregarJson(diretorio, arquivo) {
    var resposta = await fetch(`/s3Route/dados/${diretorio}/${arquivo}`);
    var dados = await resposta.json();
    return dados;
}
// carregarJson(`empresa-${sessionStorage.getItem('ID_EMPRESA')}`, "downtime.json");
// carregarJson(`empresa-${sessionStorage.getItem('ID_EMPRESA')}`, "alertas.json");

async function carregarDowntime() {
    //Carregar Downtime total da Região
    downtime_regiao = document.getElementById('downtime_regiao');
    var downtime = cacheDowntime;

    totalDowntimeRegiao = 0;
    for (var i = 0; i < downtime.length; i++) {
        totalDowntimeRegiao += (downtime[i].downtime7Dia * -1);

    }
    downtime_regiao.innerHTML = converterHoras(totalDowntimeRegiao);

    //Carregar Modelo com maior Downtime
    modelo_pior = document.getElementById('p_modelo_downtime_pior');
    downtime_pior = document.getElementById('p_pior_downtime');

    vmodelo_pior = downtime[0].modelo;
    vdowntime_pior = downtime[0].downtime7Dia * -1;

    for (var i = 1; i < downtime.length; i++) {
        if ((downtime[i].downtime7Dia * -1) > vdowntime_pior) {
            vmodelo_pior = downtime[i].modelo;
            vdowntime_pior = downtime[i].downtime7Dia * -1;
        }
    }

    modelo_pior.innerHTML = "Modelo " + vmodelo_pior;
    downtime_pior.innerHTML = converterHoras(vdowntime_pior);

    regiao_agora = document.getElementById('regiao_agora');
    regiao_agora.innerHTML = "Região " + sessionStorage.getItem('SIGLA_REGIAO');

    return vmodelo_pior;
}

function converterHoras(horasDecimais) {
    var horas = Math.floor(horasDecimais);
    var minutos = Math.round((horasDecimais - horas) * 60);
    return `${horas}h${minutos}min`;
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

            if (resposta.ok) {
                resposta.json().then(data => {
                    componentes = data;
                    plotarModelosCriticos(componentes)
                    plotarAlertasComponentes(componentes)
                });
            } else {
                console.log("Erro ao Pegar Modelos");

            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}

async function plotarModelosCriticos(componentes) {
    var alertas = cacheAlertas;

    //é tipo um enum que vimos na Célia, porém vi que dá para fazer para o JS também
    //é literalmente só um objeto, mas ele é utilizado como um enum
    var pesos = { "Muito Perigoso": 3, "Perigoso": 2, "Atenção": 1 };
    let final = {};

    //For para os componentes
    for (var i = 0; i < componentes.length; i++) {
        var componenteAtual = componentes[i].nome;
        var pontuacao = {};

        //For para os alertas
        for (var j = 0; j < alertas.length; j++) {
            var alertaAtual = alertas[j];
            if (alertaAtual.componente == componenteAtual) {
                var mAlert = alertaAtual.modelo;
                var ponto = pesos[alertaAtual.grau];

                if (!pontuacao[mAlert]) { pontuacao[mAlert] = 0; }
                pontuacao[mAlert] += ponto;
            }
        }
        var mCritico = "";
        var mPontuacao = 0;

        for (var modeloPoint in pontuacao) {
            if (pontuacao[modeloPoint] > mPontuacao) {
                mPontuacao = pontuacao[modeloPoint];
                mCritico = modeloPoint
            }
        }
        final[componenteAtual] = {
            modelo: mCritico,
            peso: mPontuacao,
            componente: componenteAtual
        }
    }

    //Plotando no html
    corpo_modelos = document.getElementById('modelos_criticos');
    for (var componente in final) {
        corpo_modelos.innerHTML += `
        <div class="modelo">
        <h2>${componente}</h2>
        <p>${final[componente].modelo}</p>
        </div>
        `;
    }
    pior_downtime = carregarDowntime();

    corpo_modelos.innerHTML += `
        <div class="modelo">
        <h2>DOWNTIME</h2>
        <p>${vmodelo_pior}</p>
        </div>
        `;
}

async function gerarGraficoPizza(totens) {
    var alertas = cacheAlertas;
    total_alertas_p = document.getElementById('total_alertas');
    total_alertas_p.innerHTML = alertas.length + " Alertas";

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
        },
        body: JSON.stringify({
            fkEmpresa: sessionStorage.getItem('FK_EMPRESA')
        }),
    })
        .then(function (resposta) {

            if (resposta.ok) {
                resposta.json().then(data => {
                    modelos = data;
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

async function plotarModelos(modelos) {
    div_modelos = document.getElementById('modelos');
    var alertas = cacheAlertas;

    //Aqui vou precisar buscar todos os totens associados à um modelo para depois ver a quantidade
    //de alertas associados á esse modelo, e depois disso dá para mudar a cor
    for (var i = 0; i < modelos.length; i++) {
        modeloAtual = modelos[i];
        totalAlertasAtual = 0;
        totalTotensAtual = 0;

        //For para os alertas
        for (var j = 0; j < alertas.length; j++) {
            //Filtrando pelo modelo atual
            if (alertas[j].modelo == modeloAtual.NomeModelo) {
                totalAlertasAtual++;
            }
        }

        //Carregar Totens e depois filtrar pelo modelo atual
        var dados = await fetch("/gestor/buscarTotensPorModelo", {method: "POST",headers: { "Content-Type": "application/json" }});
        totens_por_modelo = await dados.json();


        //Vendo a quantidade de totens que esse modelo tem
        for (var g = 0; g < totens_por_modelo.length; g++) {
            if (modeloAtual.NomeModelo == totens_por_modelo[g].nome) {
                totalTotensAtual++;
            }
        }

        metrica = totalAlertasAtual / totalTotensAtual
        if (metrica < 0.3) {
            cor = "#65fa8f";
        } else if (metrica < 0.5) {
            cor = "#fada64";
        } else if (metrica < 0.7) {
            cor = "#f98a25";
        } else {
            cor = "#ff3131";
        }

        div_modelos.innerHTML += `
        <div class="modelo">
        <h2>${modelos[i].NomeModelo}</h2>
        <div class="color" id="color_modelo" style="background-color:${cor}"></div>
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
            if (resposta.ok) {
                resposta.json().then(data => {
                    totens = data;
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

    var alertas = cacheAlertas;
    metrica = alertas.length / totens.length

    if (metrica < 0.3) {
        cor = "#65fa8f";
    } else if (metrica < 0.5) {
        cor = "#fada64";
    } else if (metrica < 0.7) {
        cor = "#f98a25";
    } else {
        cor = "#ff3131";
    }

    kpi_integridade = document.getElementById('first-kpi');
    kpi_integridade.style.borderLeft = `10px solid ${cor}`;
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
            if (resposta.ok) {
                resposta.json().then(data => {
                    regioes = data;
                    plotarRegioes(regioes)
                    priorizarRegiao(regioes)
                });
            } else {
                console.log("Erro ao Pegar Regiões");

            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}

async function plotarRegioes(regioes) {
    var alertas = cacheAlertas;
    console.log(alertas);
    div_regioes = document.getElementById('regioes');
    div_regioes.innerHTML = ``;
    for (var i = 0; i < regioes.length; i++) {
    var regiaoAgora = regioes[i].NomeRegiao;
    var totalAlertas = 0;
    console.log(regiaoAgora);
    

    //For para Carregar Disponibilidade
    for(var j = 0; j < alertas.length; j++){
        if(alertas[j].regiao == regiaoAgora){
            totalAlertas++;
        }
    }

    //Calculando a Disponibilidade
    var dados = await fetch("/gestor/buscarTotens", {method: "POST",headers: { "Content-Type": "application/json" },body: JSON.stringify({ nomeRegiao: regiaoAgora }),});
    total_totens = await dados.json();

    var criticidade = ((totalAlertas / total_totens.length) * 100).toFixed(0);

    div_regioes.innerHTML += `
    <div class="regiao" onclick="escolherRegiao('${regioes[i].NomeRegiao}','${regioes[i].SiglaRegiao}')">
    <h1>${regioes[i].NomeRegiao} - ${regioes[i].SiglaRegiao}</h1>
    <div class="priorizar">
    <h2>Criticidade</h2>
    <h3>${criticidade}%</h3>
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

// DESEJÁVEL
function abrirPassos() {
    popup = $("#popup-passos");
    popup.css({ display: "flex", opacity: 0, "pointer-events": "auto" }).animate({ opacity: 1 }, 300);
}
function fecharPassos() {
    popup = $("#popup-passos");
    popup.css({ display: "flex", opacity: 0, "pointer-events": "none" }).animate({ opacity: 0 }, 300);
}