SISTEMA DE VOTAÇÃO ELETRÔNICA
==============================

Tecnologias:
- HTML5
- CSS3
- JavaScript
- localStorage (API local simulada)

COMO RODAR NO VS CODE
---------------------
1. Abra a pasta "votacao-eletronica" no VS Code.
2. Instale a extensão "Live Server", caso ainda não tenha.
3. Clique com o botão direito em index.html.
4. Escolha "Open with Live Server".
5. Faça o cadastro e teste os dois votos.

FLUXO
-----
index.html -> identificação
urna.html  -> 2 votos entre os candidatos 10, 20, 30 e 40
final.html -> confirmação + som

DADOS
-----
Os eleitores e votos são armazenados no localStorage do navegador.
Para zerar os resultados:
- Abra o DevTools (F12)
- Console
- Execute: API.limparDados()
- Recarregue a página.

IMPORTANTE SOBRE "API"
----------------------
Como este trabalho foi configurado para rodar diretamente pelo Live Server,
não há um backend HTTP separado. O arquivo js/api.js funciona como uma camada
de API local, com operações de cadastro, registro de votos e resultados.

Se a atividade exigir obrigatoriamente uma API HTTP real, será necessário
adicionar um backend (por exemplo Node.js + Express ou JSON Server).
