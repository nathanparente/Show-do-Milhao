const TOTAL_QUESTIONS = 5; // Funciona dinamicamente com qualquer valor (5, 10, 15, 50, etc.)
const THEMES = ["Desenvolvimento Web", "UI/UX", "CRO"];

export const GAME_CONFIG = Object.freeze({
  TOTAL_QUESTIONS,
  THEMES,
  OLLAMA_URL: "http://localhost:11434/api/generate",
  MODEL_NAME: "llama3",
  TEMPERATURE: 0.4,

  GET_PROMPT: (temas, quantidade) => {
    // Cálculo dos intervalos em porcentagem
    const easyEnd = Math.floor(quantidade * 0.5);
    const mediumStart = easyEnd + 1;
    const mediumEnd = Math.floor(quantidade * 0.8);
    const hardStart = mediumEnd + 1;

    // Regras dinâmicas de exibição dos intervalos
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

CURVA DE DIFICULDADE PROGRESSIVA POR PORCENTAGEM (OBRIGATÓRIO PARA AS ${quantidade} PERGUNTAS):
- ${easyRangeText} (0% a 50% - NÍVEL FÁCIL): Conceitos fundamentais, definições diretas e sintaxe basilar.
- ${mediumRangeText} (50% a 80% - NÍVEL MÉDIO): Boas práticas, cenários práticos intermediários e resolução de problemas cotidianos.
- ${hardRangeText} (80% a 100% - NÍVEL DIFÍCIL/ESPECIALISTA): Análise de arquitetura avançada, diagnósticos em produção, métricas complexas e trade-offs críticos.

DIRETRIZES DE CONTEÚDO:
1. Respeite rigidamente a transição de dificuldade entre os blocos definidos.
2. Todas as perguntas devem contextualizar um cenário vivido por profissionais de tecnologia.
3. As alternativas incorretas devem ser plausíveis e conter "pegadinhas" técnicas legítimas.

REGRAS ESTREITAS DE FORMATO:
1. "correta": O TEXTO COMPLETO e detalhado da resposta certa. NUNCA coloque apenas letras (A, B, C, D).
2. "incorretas": Array com EXATAMENTE 3 alternativas erradas.
3. PROIBIDO colocar prefixos como "A)", "B)", "1." ou letras no início das respostas.

Siga estritamente este exemplo de formato JSON:
{
  "perguntas": [
    {
      "pergunta": "Durante um teste A/B no fluxo de pagamento, a variação B apresentou maior CTR no botão, mas menor taxa de finalização de compra. Qual viés ou métrica explica melhor esse comportamento?",
      "correta": "Efeito de atrito de intenção, onde o design facilitou o clique acidental sem qualificar o usuário para a compra.",
      "incorretas": [
        "Aumento da taxa de rejeição causado exclusivamente por falha no carregamento do script de CRO.",
        "Erro de amostragem estatística resultante de uma divisão de tráfego de 50/50.",
        "Incompatibilidade nativa de CSS Grid em dispositivos móveis modernos."
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
});
