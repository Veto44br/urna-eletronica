const eleitor = JSON.parse(localStorage.getItem("eleitorAtual") || "null");

if (!eleitor) {
  window.location.href = "index.html";
}

const candidatosEl = document.getElementById("candidatos");
const selecionadoEl = document.getElementById("selecionado");
const confirmarBtn = document.getElementById("confirmarBtn");
const contadorEl = document.getElementById("contador");
const tituloEl = document.getElementById("tituloVoto");
const mensagemEl = document.getElementById("mensagem");
const resultadosEl = document.getElementById("resultados");
const fontBtn = document.getElementById("fontBtn");

let votoAtual = Number(localStorage.getItem("votoAtual") || 1);
let candidatoSelecionado = null;

function renderCandidatos() {
  candidatosEl.innerHTML = "";

  API.candidatos.forEach(candidato => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "candidate";
    button.setAttribute(
      "aria-label",
      `Candidato número ${candidato.numero}, ${candidato.nome}`
    );

    button.innerHTML = `
      <span class="number">${candidato.numero}</span>
      <span class="candidate-name">${candidato.nome}</span>
    `;

    button.addEventListener("click", () => selecionar(button, candidato));
    candidatosEl.appendChild(button);
  });
}

function selecionar(button, candidato) {
  document.querySelectorAll(".candidate").forEach(btn => {
    btn.classList.remove("selected");
    btn.setAttribute("aria-pressed", "false");
  });

  button.classList.add("selected");
  button.setAttribute("aria-pressed", "true");
  candidatoSelecionado = candidato;
  selecionadoEl.textContent = `Selecionado: ${candidato.numero} — ${candidato.nome}`;
  confirmarBtn.disabled = false;
  mensagemEl.textContent = "";
}

confirmarBtn.addEventListener("click", () => {
  if (!candidatoSelecionado) return;

  API.registrarVoto(candidatoSelecionado.numero);

  if (votoAtual === 1) {
    votoAtual = 2;
    localStorage.setItem("votoAtual", "2");
    candidatoSelecionado = null;
    confirmarBtn.disabled = true;
    selecionadoEl.textContent = "Nenhum candidato selecionado.";
    contadorEl.textContent = "VOTO 2 DE 2";
    tituloEl.textContent = "Segundo voto";
    mensagemEl.textContent = "Primeiro voto confirmado. Agora faça o segundo voto.";
    mensagemEl.className = "message success";
    renderCandidatos();
    renderResultados();
  } else {
    localStorage.removeItem("votoAtual");
    window.location.href = "final.html";
  }
});

function renderResultados() {
  resultadosEl.innerHTML = "";
  const resultados = API.obterResultados();

  resultados.forEach(item => {
    const row = document.createElement("div");
    row.className = "result-row";

    const porcentagem = item.porcentagem.toFixed(1);

    row.innerHTML = `
      <div class="result-head">
        <span>${item.numero} — ${item.nome}</span>
        <span>${porcentagem}%</span>
      </div>
      <div class="bar" role="progressbar"
           aria-label="${item.nome}: ${porcentagem}%"
           aria-valuenow="${porcentagem}" aria-valuemin="0" aria-valuemax="100">
        <div class="bar-fill" style="width: ${porcentagem}%"></div>
      </div>
      <small>${item.votos} voto(s)</small>
    `;

    resultadosEl.appendChild(row);
  });
}

fontBtn.addEventListener("click", () => {
  const atual = Number(localStorage.getItem("tamanhoFonte") || 16);
  const novo = atual >= 20 ? 16 : atual + 2;
  document.documentElement.style.fontSize = `${novo}px`;
  localStorage.setItem("tamanhoFonte", novo);
});

const tamanhoSalvo = localStorage.getItem("tamanhoFonte");
if (tamanhoSalvo) document.documentElement.style.fontSize = `${tamanhoSalvo}px`;

renderCandidatos();
renderResultados();