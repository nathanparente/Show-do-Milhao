export * from "./game";
export * from "./quizPrompt";
export * from "./uiTexts";

export const UI_TEXTS = Object.freeze({
  //HOME
  HOME_INSTRUCTIONS_BUTTON: "Como Jogar",

  //LOADING SCREEN
  LOADING_TITLE: "Nossa LLama Tech está gerando as perguntas do jogo...",

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
  HELP_IA: "Após discutirem, Gepeto, Claudião e Geminice conluíram que ....",

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

  //GAME INSTRUCTIONS - TELA
  INSTRUCTIONS_BUTTON: "Entendi",
  INSTRUCTIONS_ARIA_PREV: "Card anterior",
  INSTRUCTIONS_ARIA_NEXT: "Próximo card",
  INSTRUCTIONS_ARIA_PAUSE: "Pausar",
  INSTRUCTIONS_ARIA_PLAY: "Reproduzir",

  //GAME INSTRUCTIONS - CARDS
  INSTRUCTIONS_MODES_TITLE: "Modos de Jogo",
  INSTRUCTIONS_MODES_TEXT:
    "Existem 2 modos de jogo: “Playoffs” e “Corrida do Milhão”.",

  INSTRUCTIONS_PLAYOFFS_TITLE: "Playoffs",
  INSTRUCTIONS_PLAYOFFS_TEXT:
    "Uma batalha entre 2 jogadores para ver quem ganha mais pontos ao acertar mais perguntas.",

  INSTRUCTIONS_MILLION_TITLE: "Corrida do Milhão",
  INSTRUCTIONS_MILLION_TEXT:
    "O modo clássico, com apenas 1 jogador. Cada pergunta vale um valor em dinheiro e, se acertar a última, você ganha 1 milhão de reais!",

  INSTRUCTIONS_HELPS_TITLE: "As Ajudas",
  INSTRUCTIONS_HELPS_TEXT_1:
    "O jogo tem 4 ajudas: “Cartas”, “IA”, “Universitários” e “Pulo”.",
  INSTRUCTIONS_HELPS_TEXT_2:
    "Cada jogador só pode usar cada ajuda 1 vez por jogo.",

  INSTRUCTIONS_CARTAS_TITLE: "Cartas",
  INSTRUCTIONS_CARTAS_TEXT:
    "Ao escolher um naipe, você elimina uma quantidade aleatória de alternativas erradas.",

  INSTRUCTIONS_IA_TITLE: "IA",
  INSTRUCTIONS_IA_TEXT:
    "Você recebe a resposta correta e vê qual é a alternativa certa para selecionar.",

  INSTRUCTIONS_UNIVERSITARIOS_TITLE: "Universitários",
  INSTRUCTIONS_UNIVERSITARIOS_TEXT:
    "Conte com a ajuda dos colegas: eles opinam sobre qual alternativa acham que é a correta.",

  INSTRUCTIONS_SKIP_TITLE: "Pulo",
  INSTRUCTIONS_SKIP_TEXT:
    "Pule para a próxima pergunta sem ganhar nem perder pontos ou dinheiro.",

  INSTRUCTIONS_TRUCO_TITLE: "Truco (Playoffs)",
  INSTRUCTIONS_TRUCO_TEXT_1:
    "Na sua vez, o adversário pode pedir “truco” e isso muda a dinâmica do jogo.",
  INSTRUCTIONS_TRUCO_TEXT_2:
    "Ao aceitar: acerte e ganhe {truco_simple_win} pts; erre e perca metade dos pontos + {truco_simple_penalty} pts do saldo.",
  INSTRUCTIONS_TRUCO_TEXT_3:
    "Ao “dobrar a aposta”, a vez vai para o adversário: acerto vale +{truco_double_win} pts; erro tira {truco_doubled_penalty} pts.",
  INSTRUCTIONS_GIVEUP_TITLE: "Desistir",
  INSTRUCTIONS_GIVEUP_TEXT:
    "Se o jogador da vez quiser desistir, ele não perde pontos e passa a vez.",
});
