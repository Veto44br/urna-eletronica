const eleitor =
  JSON.parse(localStorage.getItem("eleitorAtual") || "null");

if (!eleitor) {
  window.location.href = "index.html";
}

const numeroDigitadoEl = document.getElementById("numeroDigitado");
const candidatePreview = document.getElementById("candidatePreview");
const candidatePhoto = document.getElementById("candidatePhoto");
const candidateNumberEl = document.getElementById("candidateNumber");
const candidateNameEl = document.getElementById("candidateName");
const selecionadoEl = document.getElementById("selecionado");
const confirmarBtn = document.getElementById("confirmarBtn");
const corrigirBtn = document.getElementById("corrigirBtn");
const contadorEl = document.getElementById("contador");
const tituloEl = document.getElementById("tituloVoto");
const mensagemEl = document.getElementById("mensagem");
const resultadosEl = document.getElementById("resultados");
const fontBtn = document.getElementById("fontBtn");
const keyButtons = document.querySelectorAll(".key");

let votoAtual = Number(localStorage.getItem("votoAtual") || 1);
let numeroDigitado = "";
let candidatoSelecionado = null;

// --------------------------------------------------
// SOM DE BIP DA URNA
// --------------------------------------------------

let audioContext = null;

function tocarBip() {
  try {
    const AudioContext =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) return;

    if (!audioContext) {
      audioContext = new AudioContext();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);

    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.12,
      audioContext.currentTime + 0.005
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + 0.075
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.08);
  } catch (erro) {
    console.warn("Não foi possível tocar o bip:", erro);
  }
}

// --------------------------------------------------
// TECLADO
// --------------------------------------------------

keyButtons.forEach(button => {
  button.addEventListener("click", () => {
    tocarBip();
    adicionarDigito(button.dataset.digit);
  });
});

function adicionarDigito(digito) {
  if (numeroDigitado.length >= 2) {
    return;
  }

  numeroDigitado += digito;
  atualizarTelaNumero();

  mensagemEl.textContent = "";
  mensagemEl.className = "message";

  if (numeroDigitado.length === 2) {
    procurarCandidato();
  } else {
    limparCandidato();
    selecionadoEl.textContent =
      "Digite o segundo número para identificar o candidato.";
  }
}

function atualizarTelaNumero() {
  numeroDigitadoEl.textContent =
    numeroDigitado.padEnd(2, "_");
}

function procurarCandidato() {
  candidatoSelecionado =
    API.candidatos.find(
      candidato => candidato.numero === numeroDigitado
    ) || null;

  if (!candidatoSelecionado) {
    limparCandidato();

    selecionadoEl.textContent =
      "Candidato não encontrado. Pressione CORRIGE e digite novamente.";

    mensagemEl.textContent =
      "Número de candidato inválido.";
    mensagemEl.className = "message error";

    confirmarBtn.disabled = true;
    return;
  }

  mostrarCandidato(candidatoSelecionado);

  selecionadoEl.textContent =
    `Candidato ${candidatoSelecionado.numero} selecionado. Confira os dados e pressione CONFIRMA.`;

  mensagemEl.textContent = "";
  mensagemEl.className = "message";

  confirmarBtn.disabled = false;
}

function mostrarCandidato(candidato) {
  candidatePreview.hidden = false;
  candidatePhoto.src = candidato.foto;
  candidatePhoto.alt =
    `Foto de ${candidato.nome}, candidato número ${candidato.numero}`;
  candidateNumberEl.textContent = candidato.numero;
  candidateNameEl.textContent = candidato.nome;
}

function limparCandidato() {
  candidatoSelecionado = null;
  candidatePreview.hidden = true;
  candidatePhoto.src = "";
  candidatePhoto.alt = "";
  candidateNumberEl.textContent = "";
  candidateNameEl.textContent = "";
  confirmarBtn.disabled = true;
}

function corrigir() {
  tocarBip();

  numeroDigitado = "";
  atualizarTelaNumero();
  limparCandidato();

  selecionadoEl.textContent =
    "Número corrigido. Digite novamente o número do candidato.";

  mensagemEl.textContent = "";
  mensagemEl.className = "message";
}

corrigirBtn.addEventListener("click", corrigir);

// --------------------------------------------------
// CONFIRMAÇÃO
// --------------------------------------------------

confirmarBtn.addEventListener("click", async () => {
  tocarBip();

  if (!candidatoSelecionado) return;

  confirmarBtn.disabled = true;
  corrigirBtn.disabled = true;

  // PRIMEIRO VOTO
  if (votoAtual === 1) {
    localStorage.setItem(
      "voto1",
      candidatoSelecionado.numero
    );

    votoAtual = 2;
    localStorage.setItem("votoAtual", "2");

    numeroDigitado = "";
    atualizarTelaNumero();
    limparCandidato();

    corrigirBtn.disabled = false;

    contadorEl.textContent = "VOTO 2 DE 2";
    tituloEl.textContent = "Segundo voto";

    selecionadoEl.textContent =
      "Primeiro voto confirmado. Digite o número do candidato para o segundo voto.";

    mensagemEl.textContent =
      "Primeiro voto confirmado. Agora faça o segundo voto.";
    mensagemEl.className = "message success";

    await renderResultados();
    return;
  }

  // SEGUNDO VOTO
  if (votoAtual === 2) {
    const voto1 = localStorage.getItem("voto1");
    const voto2 = candidatoSelecionado.numero;

    mensagemEl.textContent = "Registrando seus votos...";
    mensagemEl.className = "message success";

    try {
      const resposta = await API.registrarVotos(
        eleitor.documento,
        voto1,
        voto2
      );

      if (!resposta.ok) {
        mensagemEl.textContent =
          resposta.erro ||
          "Não foi possível registrar os votos.";
        mensagemEl.className = "message error";

        confirmarBtn.disabled = false;
        corrigirBtn.disabled = false;
        return;
      }

      localStorage.removeItem("votoAtual");
      localStorage.removeItem("voto1");
      localStorage.removeItem("voto2");

      window.location.href = "final.html";

    } catch (erro) {
      console.error(erro);

      mensagemEl.textContent =
        "Erro ao conectar com a API.";
      mensagemEl.className = "message error";

      confirmarBtn.disabled = false;
      corrigirBtn.disabled = false;
    }
  }
});

// --------------------------------------------------
// RESULTADOS
// --------------------------------------------------

async function renderResultados() {
  resultadosEl.innerHTML =
    "<p>Carregando resultados...</p>";

  try {
    const resposta = await API.obterResultados();

    if (!resposta.ok) {
      resultadosEl.innerHTML =
        "<p>Não foi possível carregar os resultados.</p>";
      return;
    }

    resultadosEl.innerHTML = "";

    const tituloVoto1 = document.createElement("h3");
    tituloVoto1.textContent = "Resultado — Voto 1";
    resultadosEl.appendChild(tituloVoto1);

    resposta.voto1.candidatos.forEach(item => {
      criarResultado(item, resultadosEl);
    });

    const tituloVoto2 = document.createElement("h3");
    tituloVoto2.textContent = "Resultado — Voto 2";
    tituloVoto2.style.marginTop = "24px";
    resultadosEl.appendChild(tituloVoto2);

    resposta.voto2.candidatos.forEach(item => {
      criarResultado(item, resultadosEl);
    });

  } catch (erro) {
    console.error(erro);
    resultadosEl.innerHTML =
      "<p>Erro ao carregar resultados.</p>";
  }
}

function criarResultado(item, container) {
  const row = document.createElement("div");
  row.className = "result-row";

  const candidato = API.candidatos.find(
    itemCandidato => itemCandidato.numero === String(item.numero)
  );

  const nome = candidato
    ? candidato.nome
    : `Candidato ${item.numero}`;

  const porcentagem =
    Number(item.porcentagem).toFixed(1);

  row.innerHTML = `
    <div class="result-head">
      <span>${item.numero} — ${nome}</span>
      <span>${porcentagem}%</span>
    </div>

    <div
      class="bar"
      role="progressbar"
      aria-label="${nome}: ${porcentagem}%"
      aria-valuenow="${porcentagem}"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        class="bar-fill"
        style="width: ${porcentagem}%"
      ></div>
    </div>

    <small>${item.votos} voto(s)</small>
  `;

  container.appendChild(row);
}

// --------------------------------------------------
// TAMANHO DA FONTE
// --------------------------------------------------

fontBtn.addEventListener("click", () => {
  const atual =
    Number(localStorage.getItem("tamanhoFonte") || 16);

  const novo =
    atual >= 20 ? 16 : atual + 2;

  document.documentElement.style.fontSize =
    `${novo}px`;

  localStorage.setItem("tamanhoFonte", novo);
});

const tamanhoSalvo =
  localStorage.getItem("tamanhoFonte");

if (tamanhoSalvo) {
  document.documentElement.style.fontSize =
    `${tamanhoSalvo}px`;
}

// --------------------------------------------------
// INICIALIZAÇÃO
// --------------------------------------------------

atualizarTelaNumero();
renderResultados();
