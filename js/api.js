const API_URL =
  "https://script.google.com/macros/s/AKfycbxjuEQuCK075kGGrY4H9HMKEOv085i_TdyDoABxV9MM9oxlfmweb0RQ1h8GebUOO4DYbw/exec";

const API = {

  // Candidatos fictícios criados por IA para a demonstração escolar.
  candidatos: [
    {
      numero: "10",
      nome: "Gabriel Almeida",
      foto: "img/candidato-10.jpg"
    },
    {
      numero: "20",
      nome: "Larissa Fernandes",
      foto: "img/candidato-20.jpg"
    },
    {
      numero: "30",
      nome: "Matheus Costa",
      foto: "img/candidato-30.jpg"
    },
    {
      numero: "40",
      nome: "Beatriz Lima",
      foto: "img/candidato-40.jpg"
    }
  ],

  async cadastrarEleitor(nome, documento) {
    const url =
      API_URL +
      "?action=cadastrar" +
      "&nome=" + encodeURIComponent(nome) +
      "&documento=" + encodeURIComponent(documento) +
      "&_=" + Date.now();

    const resposta = await fetch(url);
    return await resposta.json();
  },

  async registrarVotos(documento, voto1, voto2) {
    const url =
      API_URL +
      "?action=votar" +
      "&documento=" + encodeURIComponent(documento) +
      "&voto1=" + encodeURIComponent(voto1) +
      "&voto2=" + encodeURIComponent(voto2) +
      "&_=" + Date.now();

    const resposta = await fetch(url);
    return await resposta.json();
  },

  async obterResultados() {
    const resposta = await fetch(
      API_URL + "?action=resultados&_=" + Date.now()
    );
    return await resposta.json();
  },

  async verificarEleitor(documento) {
    const resposta = await fetch(
      API_URL +
      "?action=verificar" +
      "&documento=" +
      encodeURIComponent(documento) +
      "&_=" +
      Date.now()
    );
    return await resposta.json();
  }
};
