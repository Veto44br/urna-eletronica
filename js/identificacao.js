const form = document.getElementById("identificacaoForm");
const nomeInput = document.getElementById("nome");
const documentoInput = document.getElementById("documento");
const mensagem = document.getElementById("mensagem");
const fontBtn = document.getElementById("fontBtn");

documentoInput.addEventListener("input", () => {
  let valor = documentoInput.value.replace(/\D/g, "").slice(0, 11);
  valor = valor.replace(/(\d{3})(\d)/, "$1.$2")
               .replace(/(\d{3})(\d)/, "$1.$2")
               .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  documentoInput.value = valor;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  mensagem.textContent = "";
  mensagem.className = "message";

  const nome = nomeInput.value.trim();
  const documento = documentoInput.value.replace(/\D/g, "");

  if (nome.length < 3) {
    mensagem.textContent = "Digite um nome válido.";
    mensagem.classList.add("error");
    nomeInput.focus();
    return;
  }

  if (documento.length !== 11) {
    mensagem.textContent = "Digite um documento com 11 números.";
    mensagem.classList.add("error");
    documentoInput.focus();
    return;
  }

  const resposta = API.cadastrarEleitor(nome, documento);
  localStorage.setItem("eleitorAtual", JSON.stringify(resposta.eleitor));
  localStorage.removeItem("votoAtual");

  mensagem.textContent = "Identificação realizada. Aguarde...";
  mensagem.classList.add("success");

  setTimeout(() => {
    window.location.href = "urna.html";
  }, 500);
});

fontBtn.addEventListener("click", () => {
  const atual = Number(localStorage.getItem("tamanhoFonte") || 16);
  const novo = atual >= 20 ? 16 : atual + 2;
  document.documentElement.style.fontSize = `${novo}px`;
  localStorage.setItem("tamanhoFonte", novo);
});

const tamanhoSalvo = localStorage.getItem("tamanhoFonte");
if (tamanhoSalvo) document.documentElement.style.fontSize = `${tamanhoSalvo}px`;