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
- **Cartas:** Uma seleção aleatória entre 1 a 4 que elimina alternativas erradas dependendo da seleção do usuário.
- **Gepeto:** Exibe a resposta correta com a ajuda da IA.
- **Universitários:** Solicita que o jogador peça ajuda de amigos para achar a resposta certa.

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
    model: "llama3",
    format: "json",
    stream: false,
    options: { temperature: 0.7 },
    prompt: `Crie 5 perguntas de múltipla escolha sobre Desenvolvimento Web, UI/UX e CRO no formato JSON...`
  })
});

const data = await response.json();
const iaJson = JSON.parse(data.response);
```

### Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

Originalmente Desenvolvido por Lucas Fioti
Adaptado por Nathan Parente