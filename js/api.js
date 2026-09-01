/*
  API LOCAL (simulada)
  Como o projeto será executado somente pelo Live Server, não existe um
  servidor Node/Express rodando. Por isso, este arquivo simula uma API REST
  usando localStorage, mantendo os dados entre as páginas.

  Se o professor exigir uma API HTTP real, este módulo pode ser substituído
  posteriormente por fetch() para um backend.
*/

const API = {
  candidatos: [
    { numero: "10", nome: "Candidato 10" },
    { numero: "20", nome: "Candidato 20" },
    { numero: "30", nome: "Candidato 30" },
    { numero: "40", nome: "Candidato 40" }
  ],

  obterEleitores() {
    return JSON.parse(localStorage.getItem("eleitores") || "[]");
  },

  cadastrarEleitor(nome, documento) {
    const eleitores = this.obterEleitores();
    const existente = eleitores.find(e => e.documento === documento);

    if (existente) return { sucesso: true, eleitor: existente, existente: true };

    const eleitor = {
      id: Date.now().toString(),
      nome,
      documento,
      criadoEm: new Date().toISOString()
    };

    eleitores.push(eleitor);
    localStorage.setItem("eleitores", JSON.stringify(eleitores));
    return { sucesso: true, eleitor, existente: false };
  },

  obterVotos() {
    return JSON.parse(localStorage.getItem("votos") || '{"10":0,"20":0,"30":0,"40":0}');
  },

  registrarVoto(numero) {
    const votos = this.obterVotos();
    if (!(numero in votos)) return false;
    votos[numero]++;
    localStorage.setItem("votos", JSON.stringify(votos));
    return true;
  },

  obterResultados() {
    const votos = this.obterVotos();
    const total = Object.values(votos).reduce((a, b) => a + b, 0);

    return this.candidatos.map(c => ({
      ...c,
      votos: votos[c.numero],
      porcentagem: total ? (votos[c.numero] / total) * 100 : 0
    }));
  },

  limparDados() {
    localStorage.removeItem("eleitores");
    localStorage.removeItem("votos");
    localStorage.removeItem("eleitorAtual");
    localStorage.removeItem("votoAtual");
  }
};