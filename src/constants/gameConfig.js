const TOTAL_QUESTIONS = 15; // Funciona dinamicamente com qualquer valor (5, 10, 15, 50, etc.)
const THEMES = ["Desenvolvimento Web", "UI/UX", "CRO"];

export const THEME_KEYWORDS = Object.freeze({
  "Desenvolvimento web": [
    "git",
    "gitflow",
    "recursividade",
    "loops",
    "pipeline",
    "css",
    "javascript",
    "styleguide",
    "wordpress",
    "next.js",
    "typescript",
    "APIs",
    "autenticação",
    "captcha",
    "inputs",
    "core web vitals",
    "SQL",
    "CORS",
    "JWT",
    "REST",
    "DOM",
    "LocalStorage",
    "Heading tags",
    "HTML Semantic tags",
  ],
  // Você pode adicionar mais temas no futuro aqui:
  // "UX/UI": ["heurísticas de nielsen", "contraste", "tipografia", "affordance"]
});

export const GAME_CONFIG = Object.freeze({
  TOTAL_QUESTIONS,
  THEMES,
  OLLAMA_URL: "http://localhost:11434/api/generate",
  MODEL_NAME: "llama3.1",
  TEMPERATURE: 0.3,

  GET_PROMPT: (temas, quantidade) => {
    const easyEnd = Math.floor(quantidade * 0.5);
    const mediumStart = easyEnd + 1;
    const mediumEnd = Math.floor(quantidade * 0.8);
    const hardStart = mediumEnd + 1;

    const easyRangeText =
      easyEnd === 1 ? "Pergunta 1" : `Perguntas 1 até ${easyEnd}`;
    const mediumRangeText =
      mediumStart === mediumEnd
        ? `Pergunta \({mediumStart}`
        : `Perguntas\){mediumStart} até ${mediumEnd}`;
    const hardRangeText =
      hardStart === quantidade
        ? `Pergunta \({quantidade}`
        : `Perguntas\){hardStart} até ${quantidade}`;

    // Captura as keywords dos temas selecionados e junta tudo em um único array
    const selectedKeywords = temas
      .map((tema) => THEME_KEYWORDS[tema] || [])
      .flat();

    // Cria o bloco de texto instruindo o LLM a usar as keywords (se existirem)
    const keywordsInstruction =
      selectedKeywords.length > 0
        ? `\nESCOPO TÉCNICO OBRIGATÓRIO:\nVocê DEVE basear o conteúdo das perguntas estritamente nos seguintes tópicos e tecnologias: ${selectedKeywords.join(
            ", "
          )}. Distribua esses assuntos entre os níveis de dificuldade.`
        : "";

    return `
Você é um Arquiteto de Software Sênior e Especialista em UI/UX/CRO criando um quiz técnico de precisão absoluta.
Crie exatas \({quantidade} perguntas de múltipla escolha sobre os temas:\){temas.join(", ")}.
${keywordsInstruction}

CURVA DE DIFICULDADE PROGRESSIVA POR PORCENTAGEM:
- ${easyRangeText} (0% a 50% - NÍVEL FÁCIL): Conceitos fundamentais e definições diretas.
- ${mediumRangeText} (50% a 80% - NÍVEL MÉDIO): Sintaxe, padrões técnicos e boas práticas.
- ${hardRangeText} (80% a 100% - NÍVEL DIFÍCIL/ESPECIALISTA): Diagnósticos avançados em produção, comportamento de código, especificações formais e trade-offs críticos.

REGRAS DE OURO PARA EVITAR ERROS E AMBIGUIDADE (OBRIGATÓRIO):
1. PROIBIDO SUBJETIVIDADE E SUPERLATIVOS: É ESTRITAMENTE PROIBIDO fazer perguntas contendo palavras como "mais comum", "mais eficaz", "melhor", "mais importante", "ideal" ou "principal".
2. APENAS FATOS DETERMINÍSTICOS: As perguntas devem ser baseadas em fatos técnicos inquestionáveis (ex: "Qual cabeçalho HTTP é usado para...", "Qual método do evento impede o comportamento padrão no JS...", "O que significa a sigla...").
3. APENAS TEXTO PORTUGUÊS PT-BR: Todos os textos devem estar em português correto
4. TERMOS TÉCNICOS EM INGLÊS (en): Todos os termos técnicos como Cache, User-Agent, Framework, Hydratation, Schema, Layout, Dataset e entre outros devem ser em inglês.
5. ALTERNATIVAS SIMÉTRICAS E CURTAS: Todas as 4 alternativas DEVEM ser frases curtas de 4 a 10 palavras, sem justificativas ou explicações.
6. 1 CORRETA E 3 INCORRETAS INDISCUTÍVEIS: A alternativa correta deve ser categoricamente verdadeira e as 3 incorretas categoricamente falsas no contexto técnico.

REGRAS DE FORMATO:
1. "correta": Texto puro e curto da alternativa certa. NUNCA coloque letras (A, B, C, D).
2. "incorretas": Array com EXATAMENTE 3 alternativas erradas e curtas.
3. PROIBIDO prefixos como "A)", "B)", "1.".

Siga rigorosamente este formato JSON com exemplos para os três temas:
{
  "perguntas": [
    {
      "pergunta": "Qual método do JavaScript cancela o comportamento padrão de um evento sem interromper sua propagação?",
      "correta": "Uso do método event.preventDefault()",
      "incorretas": [
        "Uso do método event.stopPropagation()",
        "Uso do método event.stopImmediatePropagation()",
        "Uso da propriedade event.cancelBubble"
      ]
    },
    {
      "pergunta": "Qual é a razão de contraste mínima exigida pelas diretrizes WCAG 2.1 no nível AA para texto normal?",
      "correta": "Razão de contraste mínima de 4.5:1",
      "incorretas": [
        "Razão de contraste mínima de 3.0:1",
        "Razão de contraste mínima de 7.0:1",
        "Razão de contraste mínima de 2.1:1"
      ]
    },
    {
      "pergunta": "Qual valor de p (p-value) é utilizado para comprovar estatisticamente 95% de confiança em um teste A/B?",
      "correta": "Valor de p inferior a 0.05",
      "incorretas": [
        "Valor de p inferior a 0.50",
        "Valor de p superior a 0.95",
        "Valor de p igual a 1.00"
      ]
    }
  ]
}
    `;
  },
});

export const UI_TEXTS = Object.freeze({
  //LOADING SCREEN
  LOADING_TITLE: "Nossa LLama Tech está gerando as perguntas do jogo...",
  LOADING_SUBTITLE: "Já pensou no que vai gastar quando ganhar um milhão ?",

  //LOST GAME
  LOST_GAME_MODAL_TEXT:
    "Uai, já acabou ? Não foi dessa vez! Fique com uma pipoquinha de consolação 🍿",

  //ERRORS
  ERROR_TITLE: "Não foi possível conectar ao Ollama local.",
  ERROR_SUBTITLE: 'Verifique se o serviço está ativo com OLLAMA_ORIGINS="*".',
  ERROR_BUTTON: "Tentar Novamente",

  //VICTORY
  WIN_MESSAGE:
    "🎉 PARABÉNS! Você respondeu todas as perguntas do Show do Milhão!",

  //IA
  HELP_GEPETO: "Segundo o Gepeto, nossa IA que nunca mente (EU ACHO) ...",

  //UNIVERSITARIOS
  HELP_UNIVERSITARIOS:
    "Agora é a hora de contar com a força da amizade,<br /> pergunte para seus amigos se eles sabem",

  //CARDS
  HELP_CARTAS_INSTRUCTION:
    "Escolha uma carta para revelar quantas alternativas erradas serão eliminadas:",

  //HELPERS
  HELP_CARTAS_NONE: "Nenhuma alternativa errada foi eliminada!",
  HELP_CARTAS_ONE_OPTION: "1 alternativa errada foi eliminada.",
  HELP_CARTAS_SELECTED_OPTIONS: "alternativas erradas foram eliminadas.",

  //PLAYOFFS
  PLAYOFFS_TURN_LOST_TITLE: "ops! Você errou e perdeu a vez",
  PLAYOFFS_TURN_LOST_SUBTITLE: "Você perdeu metade dos seus pontos.",
  PLAYOFFS_CONTINUE_BUTTON: "Continuar Jogo",
});

export const PLAYOFFS_SCORING = Object.freeze({
  NORMAL_WIN_POINTS: 5,
  TRUCO_SIMPLE_WIN_POINTS: 10,
  TRUCO_DOUBLE_WIN_POINTS: 20,
  TRUCO_SIMPLE_ERROR_PENALTY: 10,
  TRUCO_DOUBLED_ERROR_PENALTY: 20,
});
