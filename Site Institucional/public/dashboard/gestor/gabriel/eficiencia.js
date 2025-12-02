
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

function getUltimoDomingo() {
  const hoje = new Date();
  const diaDaSemana = hoje.getDay();

  if (diaDaSemana === 0) {
    return hoje;
  }

  const domingo = new Date(hoje);
  domingo.setDate(hoje.getDate() - diaDaSemana);

  return domingo;
}

function formatarDataBR(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = String(data.getFullYear()).slice(-2);
  return `${dia}-${mes}-${ano}`;
}

/**
 * Pega o último domingo e retorna um objeto com as 4 datas 
 * (do mais recente ao mais antigo) armazenadas em chaves separadas.
 * * @param {Date} ultimoDomingo - O objeto Date do domingo mais recente.
 * @returns {Object<string, string>} Um objeto com as chaves domingo_0 a domingo_3.
 */

function getUltimos4DomingosComoObjeto(ultimoDomingo) {
  const domingos = {};
  const dataAtual = new Date(ultimoDomingo);

  for (let i = 0; i < 4; i++) {
    // A chave é dinâmica: domingo_0, domingo_1, domingo_2, domingo_3
    const chave = `domingo_${i}`;

    // Armazena a data formatada no objeto com a chave correspondente
    domingos[chave] = formatarDataBR(dataAtual);

    // Subtrai 7 dias para ir para o domingo da semana anterior
    dataAtual.setDate(dataAtual.getDate() - 7);
  }

  return domingos;
}

async function carregarDados() {

  const ultimoDomingo = getUltimoDomingo();

  // 1. CHAME A FUNÇÃO E ARMAZENE O OBJETO
  const datasDoFetch = getUltimos4DomingosComoObjeto(ultimoDomingo); // <-- CORREÇÃO AQUI

  // Desestruturação do objeto para criar as variáveis separadas
  const {
    domingo_0,
    domingo_1, 
    domingo_2,
    domingo_3
  } = datasDoFetch;

  const idEmpresa = sessionStorage.FK_EMPRESA;
  const regiao = ""

  const resposta = await fetch(`/s3Route/${idEmpresa}/${domingo_0}`);
  const resposta2 = await fetch(`/s3Route/${idEmpresa}/${domingo_1}`);
  const resposta3 = await fetch(`/s3Route/${idEmpresa}/${domingo_2}`);
  const resposta4 = await fetch(`/s3Route/${idEmpresa}/${domingo_3}`);

  const data = await resposta.json();
  const data2 = await resposta2.json();
  const data3 = await resposta3.json();
  const data4 = await resposta4.json();

  plotarDados(data, idEmpresa, regiao)
  plotarDadosGrafico(data, data2, data3, data4)
}

function plotarDados(data, idEmpresa, regiao) {

  total_tecnicos.innerHTML = data.totalTecnicos[0].qtdTecnicos;
  comparacao.innerHTML = Math.round(data.comparacao[0].percentual, 1);

  var horasIdeais = data.horasIdeais[0].horasIdeais;

  qtd_horas_ideais.innerHTML = horasIdeais;

  var duracao = Math.round((data.horasTrabalhadas[0].duracao / 60) / 60, 2);

  if (duracao <= horasIdeais) {
    qtd_horas_trabalhadas.innerHTML = `<p  style="color: green;">${duracao}</p>`;
  } else {
    qtd_horas_trabalhadas.innerHTML = `<p  style="color: green;">${duracao}</p>`;
  }

  qtd_recomendada.innerHTML = data.qtdRecomendadaDeFuncionarios[0].qtdRecomendada;

  var conteudo = ``

  for (var i = 0; i < data.horasIdeais.length; i++) {
    var item = data.horasIdeais[i];

    conteudo_tabela.innerHTML += `
        <div class="linha-tabela">
          <p>${item.regiao}</p>
          <p>${item.horasIdeais}</p>
          <p style="color: #DC2626;">1050</p>
        </div>
      `;
  }
}

function plotarDadosGrafico(data, data2, data3, data4){
  
}

var options = {
  series: [
    {
      name: 'Actual',
      data: [
        {
          x: '01/11',
          y: 890,
          goals: [
            {
              name: 'Expected',
              value: 700,
              strokeHeight: 5,
              strokeColor: '#775DD0'
            }
          ]
        },
        {
          x: '08/11',
          y: 924,
          goals: [
            {
              name: 'Expected',
              value: 700,
              strokeHeight: 5,
              strokeColor: '#775DD0'
            }
          ]
        },
        {
          x: '15/11',
          y: 680,
          goals: [
            {
              name: 'Expected',
              value: 700,
              strokeHeight: 5,
              strokeColor: '#775DD0'
            }
          ]
        },
        {
          x: '22/11',
          y: 876,
          goals: [
            {
              name: 'Expected',
              value: 700,
              strokeHeight: 5,
              strokeColor: '#775DD0'
            }
          ]
        }
      ]
    }
  ],
  chart: {
    height: 350,
    type: 'bar'
  },
  title: {
    text: 'Comparação de Capacidade Operacional',
    align: 'center',
    style: {
      fontSize: '16px',
      fontWeight: 'bold',
      fontFamily: 'Poppins',
      color: '#6B46C1'
    },
  },
  subtitle: {
    text: 'Últimas 4 Semanas',
    align: 'center',
    offsetX: 0,
    offsetY: 30,
    floating: false,
    style: {
      fontSize: '14px',
      fontWeight: 'normal',
      color: '#9699a2'
    },
  },
  plotOptions: {
    bar: {
      columnWidth: '60%'
    }
  },
  colors: ['#00E396'],
  dataLabels: {
    enabled: false
  },
  legend: {
    show: true,
    showForSingleSeries: true,
    customLegendItems: ['Horas Trabalhadas', 'Horas Ideais'],
    markers: {
      fillColors: ['#00E396', '#775DD0']
    }
  }
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();

function abrirEscolha() {
  const popup = document.getElementById("popup-escolha");
  popup.style.display = "flex";
  popup.style.opacity = "0";
  popup.style.pointerEvents = "auto";

  // Animação de entrada
  setTimeout(() => {
    popup.style.transition = "opacity 0.3s ease";
    popup.style.opacity = "1";
  }, 10);

  carregarRegioesCadastradas();
}

function fecharEscolha() {
  const popup = document.getElementById("popup-escolha");
  popup.style.opacity = "0";
  popup.style.pointerEvents = "none";

  setTimeout(() => {
    popup.style.display = "none";
  }, 300);
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
  const div_regioes = document.getElementById('regioes');
  div_regioes.innerHTML = '';

  regioes.forEach(regiao => {
    div_regioes.innerHTML += `
      <div class="regiao" onclick="escolherRegiao('${regiao.NomeRegiao}', '${regiao.SiglaRegiao}')">
        <h1>${regiao.NomeRegiao} - ${regiao.SiglaRegiao}</h1>
      </div>
    `;
  });
}

function priorizarRegiao() {
  document.getElementById('priorizar').style.display = 'none';
}

function abrirPassos() {
  popup = $("#popup-passos");
  popup.css({ display: "flex", opacity: 0, "pointer-events": "auto" }).animate({ opacity: 1 }, 300);
}
function fecharPassos() {
  popup = $("#popup-passos");
  popup.css({ display: "flex", opacity: 0, "pointer-events": "none" }).animate({ opacity: 0 }, 300);
}

function ativarPopup() {
  popup = $("#popup-logout");
  popup.css({ display: "flex", opacity: 0, "pointer-events": "auto" }).animate({ opacity: 1 }, 300);
}
function fecharPopup() {
  popup = $("#popup-logout");
  popup.css({ display: "flex", opacity: 0, "pointer-events": "none" }).animate({ opacity: 0 }, 300);
}