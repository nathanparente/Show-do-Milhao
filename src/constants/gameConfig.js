const TOTAL_QUESTIONS = 5;
const THEMES = ["Desenvolvimento Web", "UI/UX", "CRO"];

export const GAME_CONFIG = Object.freeze({
  TOTAL_QUESTIONS,
  THEMES,
  OLLAMA_URL: "http://localhost:11434/api/generate",
  MODEL_NAME: "llama3",
  TEMPERATURE: 0.3,
  PROMPT: `Você é o gerador oficial de perguntas do Show do Milhão.
Crie ${TOTAL_QUESTIONS} perguntas de múltipla escolha sobre: ${THEMES.join(
    ", "
  )}.

REGRAS OBRIGATÓRIAS:
1. "correta": Deve conter O TEXTO COMPLETO da resposta certa. NUNCA coloque apenas letras como "A", "B", "C" ou "D".
2. "incorretas": Deve conter um array com EXATAMENTE 3 textos de respostas erradas.
3. PROIBIDO colocar prefixos como "A)", "B)", "a.", "1." ou letras nas respostas. Retorne APENAS o texto puro.

Siga estritamente este exemplo JSON:
{
  "perguntas": [
    {
      "pergunta": "Qual elemento HTML é utilizado para criar um link?",
      "correta": "Tag <a>",
      "incorretas": ["Tag <link>", "Tag <href>", "Tag <url>"]
    }
  ]
}`,
});

export const UI_TEXTS = Object.freeze({
  LOADING_TITLE: "🦙 Aguarde enquanto nossas lhamas separam as perguntas 🦙",
  LOADING_SUBTITLE: "Já pensou no que vai gastar quando ganhar um milhão ?",
  LOST_GAME_MODAL_TEXT:
    "Mas já? Não foi dessa vez que vai levar o milhão então fique com uma pipoquinha de consolação 🍿",
  ERROR_TITLE: "Não foi possível conectar ao Ollama local.",
  ERROR_SUBTITLE: 'Verifique se o serviço está ativo com OLLAMA_ORIGINS="*".',
  ERROR_BUTTON: "Tentar Novamente",
  WIN_MESSAGE:
    "🎉 PARABÉNS! Você respondeu todas as perguntas do Show do Milhão!",
});

export const CHART_DEFAULT_DATA = Object.freeze([
  ["Alternativas", "Porcentagem de votos da platéia"],
  ["A", 0],
  ["B", 0],
  ["C", 0],
  ["D", 0],
]);
