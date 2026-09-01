const eleitor = JSON.parse(localStorage.getItem("eleitorAtual") || "null");
const nomeEl = document.getElementById("nomeEleitor");
const novoBtn = document.getElementById("novoBtn");
const fontBtn = document.getElementById("fontBtn");

if (!eleitor) {
  window.location.href = "index.html";
} else {
  nomeEl.textContent = eleitor.nome;
}

function tocarSomConclusao() {
  const som = new Audio("sons/som_urna.mp3");

  som.volume = 1.0;
  som.play().catch(() => {
    console.log("O navegador bloqueou a reprodução automática do áudio.");
  });
}

window.addEventListener("load", () => {
  setTimeout(tocarSomConclusao, 250);
});

novoBtn.addEventListener("click", () => {
  localStorage.removeItem("eleitorAtual");
  localStorage.removeItem("votoAtual");
  window.location.href = "index.html";
});

fontBtn?.addEventListener("click", () => {
  const atual = Number(localStorage.getItem("tamanhoFonte") || 16);
  const novo = atual >= 20 ? 16 : atual + 2;
  document.documentElement.style.fontSize = `${novo}px`;
  localStorage.setItem("tamanhoFonte", novo);
});