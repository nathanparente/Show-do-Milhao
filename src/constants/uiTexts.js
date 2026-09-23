export * from "./game";
export * from "./quizPrompt";
export * from "./uiTexts";

export const UI_TEXTS = Object.freeze({
  //LOADING SCREEN
  LOADING_TITLE: "Nossa LLama Tech está gerando as perguntas do jogo...",
  LOADING_SUBTITLE: "Já pensou no que vai gastar quando ganhar um milhão ?",

  //LOST GAME
  LOST_GAME_MODAL_TEXT:
    "Uai, já acabou ? Não foi dessa vez! Fique com uma pipoquinha de consolação 🍿",
  LOST_MILLION_GAME_TEXT: "Total: ",

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

  //PROGRESS PHASES
  PHASE_WAITING: "Preparando o LLama Tech...",
  PHASE_GENERATING: "Gerando pergunta {current} de {total}...",
  PHASE_VALIDATING: "Revisando as perguntas...",
  PHASE_REGENERATING: "Refazendo pergunta {current} de {total}...",
  PHASE_DONE: "Tudo pronto!",
});
