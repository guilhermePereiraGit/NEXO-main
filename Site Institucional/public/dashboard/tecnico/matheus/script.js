function ativar(escolha) {
    document.getElementById(escolha).style.display = 'block';
    document.getElementById(escolha).style.animation = 'expandirEsquerda 0.5s ease forwards';
    if (escolha === 'fundo2') {
        document.getElementById("box").style.display = "block";
        document.getElementById("dashboard").style.display = "none";
        document.getElementById('fundo3').style.animation = 'recolherDireita 0.5s ease forwards';
        document.getElementById('fundo4').style.animation = 'recolherDireita 0.5s ease forwards';
        document.getElementById("second").style.color = "#451c8b";
        document.getElementById("third").style.color = "white";
        document.getElementById("fourth").style.color = "white";
    } else if (escolha === 'fundo3') {
        document.getElementById('fundo2').style.animation = 'recolherDireita 0.5s ease forwards';
        document.getElementById('fundo4').style.animation = 'recolherDireita 0.5s ease forwards';
        document.getElementById("third").style.color = "#451c8b";
        document.getElementById("second").style.color = "white";
        document.getElementById("fourth").style.color = "white";
        document.getElementById("box").style.display = "none";
        sessionStorage.setItem('REGIAO_ESCOLHIDA', "")
        sessionStorage.setItem('SIGLA_REGIAO', "")
        div_totens = document.getElementById('list-totens');
        div_totens.innerHTML = ``;

    } else if (escolha === 'fundo4') {
        document.getElementById('fundo2').style.animation = 'recolherDireita 0.5s ease forwards';
        document.getElementById('fundo3').style.animation = 'recolherDireita 0.5s ease forwards';
        document.getElementById("fourth").style.color = "#451c8b";
        document.getElementById("second").style.color = "white";
        document.getElementById("third").style.color = "white";
        document.getElementById("box").style.display = "none";
    }
}
aprovados = [];
function carregarDadosAprovados() {
    var idEmpresa = sessionStorage.getItem("FK_EMPRESA");

    fetch("/totem/verificarAprovados", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            idEmpresaServer: idEmpresa
        }),
    }).then(function (resposta) {
        console.log(resposta);

        if (resposta.ok) {
            resposta.json().then(data => {
                console.log(data);
                aprovados = data;
                if (aprovados.length > 0) {
                    gerarCardTotens();
                } else {
                    nadaPorAquiModelos();
                }
            })
        } else {
            console.log("Erro ao Buscar Dados!");
        }
    });
}

function nadaPorAquiModelos() {
    div_aprovados.innerHTML = `
        <div class="card-nothing">
                <h1>Sem Registros</h1>
                <p>Caso isto não seja o esperado pelo nosso sistema, considere entrar em contato com nossa equipe de suporte</p>
                <p>Estamos à sua disposição para solucionar seus incidentes e tornar sua experiência verdadeiramente NEXO.</p>
            </div>
        `;
}


function gerarCardTotens() {
    for (var i = 0; i < aprovados.length; i++) {
        var ativo = aprovados[i].status === "ATIVO";

        var ativarDisabled = ativo ? "disabled" : "";
        var desativarDisabled = ativo ? "" : "disabled";

        var ativarStyle = ativo
            ? "background-color: #a5d6a7; cursor: not-allowed; opacity: 0.6;"
            : "background-color: #4caf50; cursor: pointer;";
        var desativarStyle = ativo
            ? "background-color: #f44336; cursor: pointer;"
            : "background-color: #ef9a9a; cursor: not-allowed; opacity: 0.6;";

        div_aprovados.innerHTML += `
        <div class="card-user">
            <div class="card-first">
                <div class="labels"><label id="first">Endereço MAC:</label><label class="label-item">${aprovados[i].numMAC}</label></div>
            </div>
            <div class="card-second">
                <div class="labels"><label id="first">Status:</label><label class="label-item"><b>${aprovados[i].status}</b></label></div>
                <div class="labels"><label id="first">Modelo:</label><label class="label-item">${aprovados[i].nome}</label></div>
            </div>
            <div class="card-second">
                <div class="buttons">
                    <button class="ativar" style="${ativarStyle}" ${ativarDisabled} onclick="modificarStatusTotem(${aprovados[i].idTotem}, 'ativar')">Ativar</button>
                    <button class="desativar" style="${desativarStyle}" ${desativarDisabled} onclick="modificarStatusTotem(${aprovados[i].idTotem}, 'desativar')">Desativar</button>
                </div>
            </div>
        </div>
        `;
    }
}

/*Usando*/
let numeroTotens = 0;
var modelos = []
function carregarDadosModelo() {
    idEmpresa = sessionStorage.getItem("FK_EMPRESA");

    fetch("/modelo/buscarModelos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            fkEmpresaServer: idEmpresa
        }),
    })
        .then(resposta => {
            if (resposta.ok) {
                return resposta.json();
            } else {
                throw new Error("Erro na resposta do servidor");
            }
        })
        .then(dados => {
            for (let i = 0; i < dados.length; i++) {
                modelos.push(dados[i]);
            }
        })
        .catch(erro => {
            console.log(`#ERRO: ${erro}`);
        });
}

function abrirPopupTotem() {
    var options = ''
    for (var i = 0; i < modelos.length; i++) {
        options += `<option value='${modelos[i].IdModelo}'>${modelos[i].Nome}</option>`
    }

    input_modelos.innerHTML += options

    document.getElementById("popuptotem").style.display = "flex";
    document.getElementById("more").style.display = "none";

    carregarEstados();
}

function fecharPopupTotem() {
    document.getElementById("popuptotem").style.display = "none";
    window.location.reload();
}

function atualizarTotens() {
    const qtdTotens = Number(document.getElementById("input_qtd_de_totens").value);
    const container = document.getElementById("totens");

    container.innerHTML = "";
    numeroTotens = qtdTotens;

    if (qtdTotens <= 0 || isNaN(qtdTotens)) return;

    for (let i = 1; i <= qtdTotens; i++) {
        const divTotem = document.createElement("div");
        divTotem.classList.add("linha-totem");

        const novoInput = document.createElement("input");
        novoInput.type = "text";
        novoInput.id = `totem${i}`;
        novoInput.placeholder = `MAC ADDRESS ${i}`;

        const botaoLixeira = document.createElement("button");
        botaoLixeira.classList.add("botao-lixeira");
        botaoLixeira.innerHTML = "🗑️";
        botaoLixeira.onclick = function () {
            removerTotem(divTotem);
        };

        divTotem.appendChild(novoInput);
        divTotem.appendChild(botaoLixeira);
        container.appendChild(divTotem);
    }
}

function adicionarMaisUmTotem() {
    const container = document.getElementById("totens");
    numeroTotens++;

    const divTotem = document.createElement("div");
    divTotem.classList.add("linha-totem");

    const novoInput = document.createElement("input");
    novoInput.type = "text";
    novoInput.id = `totem${numeroTotens}`;
    novoInput.placeholder = `MAC ADDRESS ${numeroTotens}`;

    const botaoLixeira = document.createElement("button");
    botaoLixeira.classList.add("botao-lixeira");
    botaoLixeira.innerHTML = "🗑️";
    botaoLixeira.onclick = function () {
        removerTotem(divTotem);
    };

    divTotem.appendChild(novoInput);
    divTotem.appendChild(botaoLixeira);
    container.appendChild(divTotem);

    document.getElementById("input_qtd_de_totens").value = numeroTotens;
}

function removerTotem(divTotem) {
    divTotem.remove();

    numeroTotens--;
    const inputs = document.querySelectorAll("#totens input");
    inputs.forEach((input, i) => {
        input.id = `totem${i + 1}`;
        input.placeholder = `MAC ADDRESS ${i + 1}`;
    });

    document.getElementById("input_qtd_de_totens").value = numeroTotens;
}

var estados = []
function carregarEstados() {
    fetch("/endereco/buscarEstados", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(function (resposta) {

            if (resposta.ok) {
                resposta.json().then(data => {
                    estados = data;
                    plotarEstadosSelect(estados)
                })
            } else {
                console.log("Erro ao Buscar Dados!");
            }
        });
}

function plotarEstadosSelect(estados) {
    var option = `<option value="">Selecione uma opção</option>`;

    for (var i = 0; i < estados.length; i++) {
        option += `<option value="${estados[i].IdEstado}">${estados[i].Nome}</option>`;
    }

    estado_atuacao.innerHTML = option;
}

/*Usando*/
function plotarRegioesSelect(regioes) {
    var option = `<option value="">Selecione uma opção</option>`;

    for (var i = 0; i < regioes.length; i++) {
        option += `<option value="${regioes[i].IdRegiao}">${regioes[i].Nome}</option>`;
    }

    regiao_atuacao.innerHTML = option;
}

var zonas = []
function procurarZonas() {

    var selectRegiao = document.getElementById("regiao_atuacao");
    var labelSelecionada = selectRegiao.options[selectRegiao.selectedIndex].text;
    const regiao = regiao_atuacao.value;

    fetch("/endereco/buscarZonas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            idRegiaoServer: regiao
        }),
    })
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(data => {
                    zonas = data;
                    if (zonas.length > 0) {
                        plotarZonasSelect(zonas);
                    } else {
                        zona_atuacao.innerHTML = "";
                    }
                })
            } else {
                console.log("Erro ao Buscar Dados!");
            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });

}

function plotarZonasSelect(zonas) {
    var option = `<option value="">Selecione uma opção</option>`;

    for (var i = 0; i < zonas.length; i++) {
        option += `<option value="${zonas[i].IdZona}">${zonas[i].Nome}</option>`;
    }

    zona_atuacao.innerHTML = option;
}

async function cadastrarEndereco() {
    var cep = input_cep.value;
    var regiaoAtuacao = regiao_atuacao.value;
    var zonaAtuacao = zona_atuacao.value;
    var bairro = input_bairro.value;
    var cidade = input_cidade.value;
    var rua = input_rua.value;
    var numero = input_numero.value;
    var complemento = input_complemento.value;

    await fetch("/endereco/cadastrarEnderecoTotem", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            cepServer: cep,
            regiaoAtuacaoServer: regiaoAtuacao,
            zonaAtuacaoServer: zonaAtuacao,
            bairroServer: bairro,
            cidadeServer: cidade,
            ruaServer: rua,
            numeroServer: numero,
            complementoServer: complemento
        }),
    })
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error("Erro na resposta do servidor");
            }
            return resposta.json();
        })
        .then(dados => {
            let idEndereco;
            if (dados.idEndereco) {
                idEndereco = dados.idEndereco;
            } else if (dados.retornoIdEndereco && dados.retornoIdEndereco.length > 0) {
                idEndereco = dados.retornoIdEndereco[0].idEndereco;
            }
            if (idEndereco) {
                cadastrarTotem(idEndereco);
            } else {
                console.error("Não foi possível obter o ID do endereço.");
            }
        })
        .catch(erro => {
            console.log(`#ERRO: ${erro}`);
        });
}

function cadastrarTotem(idEndereco) {
    console.log("cadastrooooooo", idEndereco)
    var modelo = input_modelos.value;
    var enderecosMac = [];
    var endereco = idEndereco;

    for (let i = 1; i <= numeroTotens; i++) {
        const macAddress = document.getElementById(`totem${i}`).value;
        enderecosMac.push(macAddress)
    }

    var mensagem = ''
    if (enderecosMac.length > 1) {
        mensagem = 'Totens cadastrados com sucesso!'
    } else {
        mensagem = 'Totem cadastrado com sucesso!'
    }

    fetch("/totem/cadastrarTotem", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            modeloServer: modelo,
            enderecosMacServer: enderecosMac,
            fkEnderecoServer: endereco
        }),
    })
        .then(resposta => {
            if (resposta.status == 200) {
                alert("Cadastro realizado com sucesso!");
                window.location.reload();
            } else {
                throw new Error("Erro na resposta do servidor");
            }
        })
        .catch(erro => {
            console.log(`#ERRO: ${erro}`);
        });
}

function modificarStatusTotem(idTotem, acao) {
    fetch("/totem/modificarStatusTotem", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            idTotemServer: idTotem,
            acaoServer: acao
        }),
    })
        .then(resposta => {
            if (resposta.status == 200) {
                if (acao == "ativar") {
                    alert("Totem ativado com sucesso!");
                    window.location.reload()
                } else {
                    alert("Totem desativado com sucesso!");
                    window.location.reload()
                }

            } else {
                throw new Error("Erro na resposta do servidor");
            }
        })
        .catch(erro => {
            console.log(`#ERRO: ${erro}`);
        });
}

var regioes = [];
function atualizarCampos() {
    var selectEstado = document.getElementById("estado_atuacao");
    var labelSelecionada = selectEstado.options[selectEstado.selectedIndex].text;
    const estado = estado_atuacao.value;
    const regiaoContainer = regioes;
    const zonaContainer = zonas;

    fetch("/endereco/buscarRegioes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            idEstadoServer: estado
        }),
    })
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(data => {
                    console.log(data);
                    regioes = data;
                    plotarRegioesSelect(regioes);
                })
            } else {
                console.log("Erro ao Buscar Dados!");
            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}

var zonas = []
function procurarZonas() {

    var selectRegiao = document.getElementById("regiao_atuacao");
    var labelSelecionada = selectRegiao.options[selectRegiao.selectedIndex].text;
    const regiao = regiao_atuacao.value;

    fetch("/endereco/buscarZonas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            idRegiaoServer: regiao
        }),
    })
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(data => {
                    zonas = data;
                    if (zonas.length > 0) {
                        plotarZonasSelect(zonas);
                    } else {
                        zona_atuacao.innerHTML = "";
                    }
                })
            } else {
                console.log("Erro ao Buscar Dados!");
            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });

}
/*Usando*/
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

function plotarZonasSelect(zonas) {
    var option = `<option value="">Selecione uma opção</option>`;

    for (var i = 0; i < zonas.length; i++) {
        option += `<option value="${zonas[i].IdZona}">${zonas[i].Nome}</option>`;
    }

    zona_atuacao.innerHTML = option;
}

/*Usando*/
function irPara(escolhida) {
    if (escolhida == "box") {
        $("#box").stop().animate({ opacity: 0 }, 200, function () {
            $(this).css("display", "none");
            $("#" + escolhida).css({ display: "flex", opacity: 0 }).stop().animate({ opacity: 1 }, 300);
            carregarDados();
        });
    } else {
        $("#dashboard, #dashboard-agenda").stop().animate({ opacity: 0 }, 200, function () {
            $(this).css("display", "none");
        });
        $("#" + escolhida).css({ display: "block", opacity: 0 }).stop().animate({ opacity: 1 }, 300);
        carregarDados();
    }
}

async function carregarDados() {
    const regiao_escolhida = document.getElementById('regiao-escolhida');
    const sigla_escolhida = document.getElementById('sigla-regiao');
    if (sessionStorage.getItem('REGIAO_ESCOLHIDA')) {
        regiao_escolhida.innerHTML = sessionStorage.getItem('REGIAO_ESCOLHIDA');
        sigla_escolhida.innerHTML = sessionStorage.getItem('SIGLA_REGIAO');
        const maisAlertasJSON = sessionStorage.getItem('FK_EMPRESA') + "/" + sessionStorage.getItem('SIGLA_REGIAO');
        const dados = await carregarTotemMaisAlerta(maisAlertasJSON, "totem-mais-alertas.json");
        const kpi1 = document.getElementById('kpi1');
        kpi1.innerHTML = `<div class="titulo">
                            <h1>Totem</h1>
                            <h2>com mais alertas</h2>
                          </div>
                          <div class="dado">
                            <h2>Totem ${dados.macTotem}</h2>
                          </div>`;
        document.getElementById('waiting').style.display = 'none';
        document.getElementById('conteudo').style.display = 'block';
        document.getElementById('escolhaNew').style.display = 'block';
        carregarTotens();
    } else {
        regiao_escolhida.innerHTML = "Região não Selecionada";
        sigla_escolhida.innerHTML = "Clique em <i class='bi bi-arrow-repeat' style='cursor: pointer;' onclick=\"abrirEscolha()\"></i> para Selecionar uma Região";
        document.getElementById('escolhaNew').style.display = 'none';
        document.getElementById('conteudo').style.display = 'none';
        document.getElementById('eficiencia').style.display = 'none';
        document.getElementById('alertas').style.display = 'none';
    }
}

function escolherRegiao(regiao, sigla) {
    sessionStorage.setItem('REGIAO_ESCOLHIDA', regiao);
    sessionStorage.setItem('SIGLA_REGIAO', sigla);
    carregarTotens();
    fecharEscolha();
    carregarDados();
    gerarGraficoLinha();
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
                });
            } else {
                console.log("Erro ao Pegar Modelos");

            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
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
                // Adicione tratamento de erro mais específico
                resposta.text().then(text => {
                    console.log("Resposta do servidor:", text);
                });
            }
        })
        .catch(function (erro) {
            console.log(`#ERRO: ${erro}`);
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

async function carregarTotemMaisAlerta(diretorio, arquivo) {
    var resposta = await fetch(`/s3Route/dados/${diretorio}/${arquivo}`);
    var dados = await resposta.json();
    console.log(dados);
    return dados;
}

function plotarTotens(totens) {
    div_totens = document.getElementById('list-totens');
    for (var i = 0; i < totens.length; i++) {
        div_totens.innerHTML += `
    <div class="Totem" onclick="escolherTotem('${totens[i].numMAC}')">
    <h2>Totem ${totens[i].numMAC}</h2>
    <div class="color"></div>
    </div>
    `;
    }
}

function escolherTotem(numMAC) {
    sessionStorage.setItem("MAC_TOTEM", numMAC)
    window.location.href = '../barros/totem.html'
}

/*Usando*/
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
/*Usando*/
function ativarPopup() {
    popup = $("#popup-logout");
    popup.css({ display: "flex", opacity: 0, "pointer-events": "auto" }).animate({ opacity: 1 }, 300);
}
/*Usando*/
function fecharPopup() {
    popup = $("#popup-logout");
    popup.css({ display: "flex", opacity: 0, "pointer-events": "none" }).animate({ opacity: 0 }, 300);
}

function abrirEscolha() {
    popup = $("#popup-escolha");
    popup.css({ display: "flex", opacity: 0, "pointer-events": "auto" }).animate({ opacity: 1 }, 300);
    carregarRegioesCadastradas();
}
function fecharEscolha() {
    popup = $("#popup-escolha");
    popup.css({ display: "flex", opacity: 0, "pointer-events": "none" }).animate({ opacity: 0 }, 300);
}