VOTAÇÃO ELETRÔNICA — VERSÃO ATUALIZADA

Como testar:
1. Abra a pasta no VS Code.
2. Abra o index.html com o Live Server.
3. Faça a identificação com nome e CPF de teste.
4. Na urna, use o teclado numérico para digitar 10, 20, 30 ou 40.
5. Ao completar dois dígitos, a foto e o nome do candidato aparecem.
6. Use CORRIGE para apagar e CONFIRMA para registrar cada voto.
7. Cada botão da urna emite um bip.
8. No segundo voto, os dois votos são enviados para o Google Apps Script/Google Sheets.
9. A tela final toca o arquivo sons/som_urna.mp3.

Candidatos:
- 10 — Gabriel Almeida
- 20 — Larissa Fernandes
- 30 — Matheus Costa
- 40 — Beatriz Lima

As quatro imagens dos candidatos são fictícias e foram geradas por IA para a demonstração escolar.

Arquivos principais:
- index.html — identificação
- urna.html — urna e teclado
- final.html — conclusão
- css/style.css — estilo e responsividade
- js/api.js — conexão com o Google Apps Script
- js/identificacao.js — identificação
- js/urna.js — teclado, candidatos, votos, resultados e bip
- js/final.js — tela final e som
- img/ — fotos dos candidatos
- sons/som_urna.mp3 — som de conclusão

IMPORTANTE:
O endereço da API já está configurado em js/api.js.
Não altere a URL da API se ela continuar sendo a mesma implantação do Apps Script.

Para a apresentação, use apenas dados de teste. Não coloque CPF real de outras pessoas na planilha.
