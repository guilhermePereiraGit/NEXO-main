window.onload = function () {
    carregarDadosUser();
};

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