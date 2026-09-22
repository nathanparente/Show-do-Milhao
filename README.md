# 💰 Show do Milhão - AI Edition

<p align="center">
  <img src="./src/assets/screenshots/1.png" alt="Show do Milhão Banner" width="800" /><br><br>
  <b>Jogo de perguntas e respostas dinâmico integrado à Inteligência Artificial (Llama 3 via Ollama)</b>
</p>

<p align="center">
  <img alt="Vue.js" src="https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D">
  <img alt="Vuetify" src="https://img.shields.io/badge/Vuetify-1867C0?style=for-the-badge&logo=vuetify&logoColor=AEDDFF">
  <img alt="Ollama" src="https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logo=ollama&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge">
</p>

---

## 🎯 Sobre o Projeto

Uma releitura do clássico jogo **Show do Milhão**, focada em perguntas técnicas sobre **Desenvolvimento Web**, **UI/UX** e **CRO (Otimização de Conversão)**. 

Diferente das versões com banco de dados estático, este projeto consome a **LLM local Llama 3 (via Ollama)** para gerar perguntas, alternativas e gabaritos inéditos em formato JSON a cada nova partida.

O jogo conta com dois modos de partida: o modo **Clássico** (single player) e o modo **PlayOffs**, um modo competitivo 1x1 com sistema de turnos, apostas e eliminação.

---

## 🚀 Tecnologias Utilizadas

* **[Vue.js](https://vuejs.org/):** Framework Javascript para a interface.
* **[Vuex](https://vuex.vuejs.org/):** Gerenciamento de estado centralizado do jogo.
* **[Vuetify](https://vuetifyjs.com/):** Biblioteca de componentes UI baseada em Material Design.
* **[Ollama](https://ollama.com/):** Execução local de modelos de Inteligência Artificial.
* **[Llama 3](https://ai.meta.com/llama/):** Modelo de linguagem responsável por criar as perguntas dinamicamente.

---

## ✨ Funcionalidades

- **Perguntas Dinâmicas com IA:** Geração sem necessidade de APIs pagas ou chaves de acesso.
- **Curva de Dificuldade Progressiva (Porcentagem):** A complexidade das perguntas é calculada automaticamente com base no total de perguntas da partida:
  - 0% a 50%: Nível Fácil (conceitos fundamentais e definições).
  - 50% a 80%: Nível Médio (boas práticas e cenários práticos intermediários).
  - 80% a 100%: Nível Difícil/Especialista (arquitetura avançada, diagnósticos em produção e trade-offs críticos).
- **Cartas:** Modal com 4 naipes de baralho (com valores de 1 a 4 sorteados aleatoriamente a cada partida) que elimina a quantidade correspondente de alternativas incorretas.
- **Gepeto:** Exibe a resposta correta por extenso gerada pela IA. Fica automaticamente desabilitado na última pergunta (Pergunta do Milhão).
- **Universitários:** Solicita que o jogador peça ajuda de amigos para achar a resposta certa.

---

### 🏆 Modo PlayOffs

Modo competitivo para 2 jogadores, disputado por turnos na mesma partida. As regras a seguir se aplicam **exclusivamente** a esse modo de jogo.

#### Regras Gerais

- O **Jogador 1** inicia a partida e permanece jogando sozinho, sequencialmente, **enquanto for acertando** as perguntas (+5 pontos por acerto).
- Ao **errar uma alternativa** ou **clicar em "Desistir"**, o jogador atual sofre sua primeira falha:
  - Se o **outro jogador nunca jogou** durante toda a partida, a vez é passada para ele, que assume o controle a partir da **próxima pergunta**.
  - Se o **outro jogador já jogou alguma vez** e o jogador atual falha novamente (2ª falha, seja erro ou desistência), a partida é **encerrada imediatamente**, redirecionando para a tela de **Fim de Jogo**.
- Cada jogador possui, portanto, **apenas 1 falha permitida durante toda a partida** (erro ou desistência).

#### Botão "Desistir"

Disponível apenas no modo PlayOffs. Permite ao jogador ativo encerrar seu turno voluntariamente, mantendo o placar atual **sem penalidades de pontuação**. Segue a mesma regra de "1 falha por jogador" descrita acima: se o outro jogador já tiver jogado, a partida é encerrada.

#### Botão "Truco"

Ajuda de **uso único por jogador** (assim como Cartas, Gepeto e Universitários), disponível apenas no modo PlayOffs. Ao ser acionado, abre um modal de aposta com duas opções:

- **Aceitar:** o jogador ativo responde a pergunta atual com risco/prêmio dobrado:
  - Se **acertar**: ganha **10 pontos** (em vez de 5).
  - Se **errar**: perde a metade dos pontos atuais **e mais 10 pontos** do saldo restante, seguindo a mesma regra de troca de turno / fim de jogo do erro comum.
- **Dobrar a Aposta:** o jogador ativo encerra seu turno **sem responder** a pergunta atual, mantendo sua pontuação intacta. A vez passa para o **outro jogador**, que responderá **a mesma pergunta** (sem avançar de rota) sob risco/prêmio dobrado:
  - Se **acertar**: ganha **10 pontos**.
  - Se **errar**: perde **20 pontos** fixos, seguindo a mesma regra de troca de turno / fim de jogo do erro comum.
  - O efeito da aposta dobrada é válido **somente para essa pergunta específica**, não persistindo para as perguntas seguintes.

#### Tela de Fim de Jogo (Game Over)

Ao final da partida (por eliminação de ambos os jogadores), o usuário é redirecionado para uma tela de **ranking**, exibindo:
- Nome e pontuação final de cada jogador, ordenados do maior para o menor placar.
- Destaque visual (coroa) para o jogador vencedor, quando não há empate.
- Indicação visual (ícones de check/minus) de quais ajudas (Cartas, Gepeto, Universitários) cada jogador utilizou durante a partida.

---

## 🛠️ Como Executar o Projeto

### 1. Pré-requisitos (Configurar o Ollama)

1. Baixe e instale o **[Ollama](https://ollama.com/)**.
2. No terminal, baixe o modelo **Llama 3**:
   ```bash
   ollama pull llama3
   ````

3. Inicie o serviço do Ollama liberando o acesso CORS para a aplicação web:
    - macOS / Linux:
    ```bash 
        OLLAMA_ORIGINS="*" ollama serve
    ````

    - Windows (PowerShell):
    ```bash
        $env:OLLAMA_ORIGINS="*" ; ollama serve
    ````

### 2. Executando o Projeto Vue

1. Clone o repositório e instale as dependências:
    ```bash
        npm install
    ````

2. Inicie o servidor de desenvolvimento:
    ```bash
        npm run serve
    ```

3. Acesse no navegador http://localhost:8080

## Integração com a LLM
A comunicação com o Llama 3 ocorre por meio de chamadas HTTP POST enviadas para o endpoint local 
http://localhost:11434/api/generate utilizando retorno em JSON estrito:

```javascript
const response = await fetch("http://localhost:11434/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: GAME_CONFIG.MODEL_NAME,
    format: "json",
    stream: false,
    options: {
      temperature: GAME_CONFIG.TEMPERATURE,
      num_ctx: 4096 // Janela de contexto estendida para garantir o retorno completo
    },
    prompt: GAME_CONFIG.GET_PROMPT(GAME_CONFIG.THEMES, GAME_CONFIG.TOTAL_QUESTIONS)
  })
});

const data = await response.json();
const iaJson = JSON.parse(data.response);
```

### Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

Originalmente Desenvolvido por Lucas Fioti
Adaptado por Nathan Parente