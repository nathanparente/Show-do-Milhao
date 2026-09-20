const TOTAL_QUESTIONS = 5; // Funciona dinamicamente com qualquer valor (5, 10, 15, 50, etc.)
const THEMES = ["Desenvolvimento Web", "UI/UX", "CRO"];

export const GAME_CONFIG = Object.freeze({
  TOTAL_QUESTIONS,
  THEMES,
  OLLAMA_URL: "http://localhost:11434/api/generate",
  MODEL_NAME: "llama3",
  TEMPERATURE: 0.4,

  GET_PROMPT: (temas, quantidade) => {
    const easyEnd = Math.floor(quantidade * 0.5);
    const mediumStart = easyEnd + 1;
    const mediumEnd = Math.floor(quantidade * 0.8);
    const hardStart = mediumEnd + 1;

    const easyRangeText =
      easyEnd === 1 ? "Pergunta 1" : `Perguntas 1 até ${easyEnd}`;
    const mediumRangeText =
      mediumStart === mediumEnd
        ? `Pergunta ${mediumStart}`
        : `Perguntas ${mediumStart} até ${mediumEnd}`;
    const hardRangeText =
      hardStart === quantidade
        ? `Pergunta ${quantidade}`
        : `Perguntas ${hardStart} até ${quantidade}`;

    return `
Você é um Arquiteto de Software Sênior e Especialista em UI/UX/CRO criando um desafio técnico de alto nível.
Crie exatas ${quantidade} perguntas de múltipla escolha sobre os temas: ${temas.join(
      ", "
    )}.

Foque em conceitos, padrões de arquitetura e boas práticas consolidadas do mercado de tecnologia.

CURVA DE DIFICULDADE PROGRESSIVA POR PORCENTAGEM (OBRIGATÓRIO PARA AS ${quantidade} PERGUNTAS):
- ${easyRangeText} (0% a 50% - NÍVEL FÁCIL): Conceitos fundamentais e definições diretas.
- ${mediumRangeText} (50% a 80% - NÍVEL MÉDIO): Boas práticas e cenários práticos intermediários.
- ${hardRangeText} (80% a 100% - NÍVEL DIFÍCIL/ESPECIALISTA): Arquitetura avançada, diagnósticos e trade-offs complexos.

REGRA CRÍTICA DE CONCISÃO DAS ALTERNATIVAS (OBRIGATÓRIO):
1. FRASES CURTAS: TODAS as 4 alternativas (1 correta e 3 incorretas) DEVEM ser frases diretas de no máximo 4 a 6 palavras.
2. PROIBIDO EXPLICAR: NUNCA crie respostas longas, justificativas ou frases com mais de uma oração.
3. SIMETRIA PERFEITA: A alternativa correta DEVE ter o mesmo tamanho e estilo direto das alternativas incorretas.
4. DISTRATORES VEROSÍMEIS: As opções incorretas devem usar termos técnicos reais, porém incorretos para o contexto.

REGRAS ESTREITAS DE FORMATO:
1. "correta": Texto puro e curto da alternativa certa. NUNCA coloque apenas letras (A, B, C, D).
2. "incorretas": Array com EXATAMENTE 3 alternativas erradas e curtas.
3. PROIBIDO colocar prefixos como "A)", "B)", "1." ou letras no início das respostas.

Siga estritamente este exemplo de formato e tamanho curto de alternativas:
{
  "perguntas": [
    {
      "pergunta": "Qual é a principal característica visual do padrão Material Design do Google?",
      "correta": "Profundidade por sombras e iluminação.",
      "incorretas": [
        "Eliminação de sombras em telas planas.",
        "Texturas estritas do mundo real.",
        "Foco exclusivo em tipografia sem grids."
      ]
    }
  ]
}
`;
  },
});

export const UI_TEXTS = Object.freeze({
  LOADING_TITLE: "Nossa LLama Tech está gerando as perguntas do jogo...",
  LOADING_SUBTITLE: "Já pensou no que vai gastar quando ganhar um milhão ?",
  LOST_GAME_MODAL_TEXT:
    "Uai, já acabou ? Não foi dessa vez! Fique com uma pipoquinha de consolação 🍿",
  ERROR_TITLE: "Não foi possível conectar ao Ollama local.",
  ERROR_SUBTITLE: 'Verifique se o serviço está ativo com OLLAMA_ORIGINS="*".',
  ERROR_BUTTON: "Tentar Novamente",
  WIN_MESSAGE:
    "🎉 PARABÉNS! Você respondeu todas as perguntas do Show do Milhão!",
  HELP_GEPETO: "Segundo o Gepeto nossa IA que nunca mente ...",
  HELP_UNIVERSITARIOS:
    "Agora é a hora de contar com a força da amizade,<br /> pergunte para seus amigos se eles sabem",
  HELP_CARTAS_INSTRUCTION:
    "Escolha uma carta para revelar quantas alternativas erradas serão eliminadas:",
  HELP_CARTAS_NONE: "Nenhuma alternativa errada foi eliminada!",
  HELP_CARTAS_ONE_OPTION: "1 alternativa errada foi eliminada.",
  HELP_CARTAS_SELECTED_OPTIONS: "alternativas erradas foram eliminadas.",
});
