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

form.addEventListener("submit", async (event) => {
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

  mensagem.textContent = "Verificando identificação...";
  mensagem.classList.add("success");

  try {

    const resposta = await API.cadastrarEleitor(nome, documento);

    if (!resposta.ok) {
      mensagem.textContent =
        resposta.erro || "Não foi possível realizar a identificação.";

      mensagem.className = "message error";
      return;
    }

    const eleitor = {
      id: resposta.id,
      nome: resposta.nome || nome,
      documento: documento
    };

    localStorage.setItem(
      "eleitorAtual",
      JSON.stringify(eleitor)
    );

    localStorage.removeItem("votoAtual");
    localStorage.removeItem("voto1");
    localStorage.removeItem("voto2");

    mensagem.textContent =
      "Identificação realizada. Aguarde...";

    mensagem.className = "message success";

    setTimeout(() => {
      window.location.href = "urna.html";
    }, 500);

  } catch (erro) {

    console.error(erro);

    mensagem.textContent =
      "Erro ao conectar com a API. Verifique sua internet.";

    mensagem.className = "message error";
  }
});


// ===============================
// TAMANHO DA FONTE
// ===============================

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