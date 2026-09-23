import { PLAYOFFS_SCORING } from "@/constants";

/**
 * Mixin responsável por toda a lógica de estado e regras de negócio
 * do modo de jogo PlayOffs (pontuação, turnos, ajudas usadas, etc.)
 *
 * REGRA DE NEGÓCIO:
 * - Jogador 1 inicia a partida e joga sozinho enquanto for acertando.
 * - Ao ERRAR ou DESISTIR (1ª falha), passa a vez para o Jogador 2
 *   SOMENTE SE o Jogador 2 nunca tiver jogado antes.
 * - Se o outro jogador já tiver jogado alguma vez e o jogador atual
 *   falhar (erro ou desistência), o jogo encerra (rota "gameover").
 */
export default {
  data() {
    return {
      gameMode: localStorage.getItem("gameMode") || "",
      player1: localStorage.getItem("player1") || "Jogador 1",
      player2: localStorage.getItem("player2") || "Jogador 2",
      score1: parseInt(localStorage.getItem("score1")) || 0,
      score2: parseInt(localStorage.getItem("score2")) || 0,
      activePlayer: parseInt(localStorage.getItem("activePlayer")) || 1,

      // Indica se o jogador JÁ FALHOU (errou ou desistiu) alguma vez na partida
      p1Errored: localStorage.getItem("p1Errored") === "true",
      p2Errored: localStorage.getItem("p2Errored") === "true",

      // Indica se o jogador JÁ TEVE ALGUMA JOGADA (acertou, errou ou desistiu)
      // alguma vez durante TODA a partida (nunca reseta entre perguntas)
      p1HasPlayed: localStorage.getItem("p1HasPlayed") === "true",
      p2HasPlayed: localStorage.getItem("p2HasPlayed") === "true",

      // Controle de ajudas usadas por jogador durante toda a partida
      p1HelpsUsed: JSON.parse(localStorage.getItem("p1HelpsUsed")) || {
        cartas: false,
        gepeto: false,
        universitarios: false,
      },
      p2HelpsUsed: JSON.parse(localStorage.getItem("p2HelpsUsed")) || {
        cartas: false,
        gepeto: false,
        universitarios: false,
      },

      // Estado do Truco: indica se a jogada ATUAL está sob efeito de aposta
      // "trucoBet" pode ser: null | "simple" | "doubled"
      trucoBet: localStorage.getItem("trucoBet") || null,
      p1TrucoUsed: localStorage.getItem("p1TrucoUsed") === "true",
      p2TrucoUsed: localStorage.getItem("p2TrucoUsed") === "true",
    };
  },
  computed: {
    isPlayoffsMode() {
      return this.gameMode === "playoffs";
    },
    hasActivePlayerUsedTruco() {
      return this.activePlayer === 1 ? this.p1TrucoUsed : this.p2TrucoUsed;
    },
  },
  methods: {
    clearGameData() {
      localStorage.removeItem("gameMode");
      localStorage.removeItem("player1");
      localStorage.removeItem("player2");
      localStorage.removeItem("score1");
      localStorage.removeItem("score2");
      localStorage.removeItem("activePlayer");
      localStorage.removeItem("p1Errored");
      localStorage.removeItem("p2Errored");
      localStorage.removeItem("p1HasPlayed");
      localStorage.removeItem("p2HasPlayed");
      localStorage.removeItem("p1HelpsUsed");
      localStorage.removeItem("p2HelpsUsed");
      localStorage.removeItem("trucoBet");
      localStorage.removeItem("p1TrucoUsed");
      localStorage.removeItem("p2TrucoUsed");
      this.clearSkipData();
    },
    initPlayoffsState() {
      const qId = parseInt(this.$route.params.questionId) || 1;
      if (qId === 1 && this.isPlayoffsMode) {
        this.score1 = 0;
        this.score2 = 0;
        this.activePlayer = 1;
        this.p1Errored = false;
        this.p2Errored = false;
        this.p1HasPlayed = false;
        this.p2HasPlayed = false;
        this.p1HelpsUsed = {
          cartas: false,
          gepeto: false,
          universitarios: false,
        };
        this.p2HelpsUsed = {
          cartas: false,
          gepeto: false,
          universitarios: false,
        };

        localStorage.setItem("score1", "0");
        localStorage.setItem("score2", "0");
        localStorage.setItem("activePlayer", "1");
        localStorage.setItem("p1Errored", "false");
        localStorage.setItem("p2Errored", "false");
        localStorage.setItem("p1HasPlayed", "false");
        localStorage.setItem("p2HasPlayed", "false");
        localStorage.setItem("p1HelpsUsed", JSON.stringify(this.p1HelpsUsed));
        localStorage.setItem("p2HelpsUsed", JSON.stringify(this.p2HelpsUsed));
        this.trucoBet = null;
        this.p1TrucoUsed = false;
        this.p2TrucoUsed = false;
        localStorage.setItem("trucoBet", "");
        localStorage.setItem("p1TrucoUsed", "false");
        localStorage.setItem("p2TrucoUsed", "false");
        this.clearSkipData();
      }
    },
    /**
     * Emite o estado atual do PlayOffs para o componente pai,
     * garantindo que a UI (PlayOffs.vue) sempre reflita o estado real,
     * independente de haver navegação de rota ou não.
     */
    emitPlayoffsStateUpdate() {
      this.$emit("playoffs-state-updated", {
        player1: this.player1,
        player2: this.player2,
        score1: this.score1,
        score2: this.score2,
        activePlayer: this.activePlayer,
      });
    },
    /**
     * Marca o jogador ativo como "já teve uma jogada" (independente do resultado)
     * alguma vez durante toda a partida. Nunca é resetado entre perguntas.
     */
    markActivePlayerHasPlayed() {
      if (this.activePlayer === 1) {
        this.p1HasPlayed = true;
        localStorage.setItem("p1HasPlayed", "true");
      } else {
        this.p2HasPlayed = true;
        localStorage.setItem("p2HasPlayed", "true");
      }
    },
    /**
     * Verifica se o OUTRO jogador (que não o ativo) já teve
     * alguma jogada durante toda a partida.
     * IMPORTANTE: deve ser chamado ANTES de trocar o activePlayer.
     */
    hasOtherPlayerPlayedBefore() {
      return this.activePlayer === 1 ? this.p2HasPlayed : this.p1HasPlayed;
    },
    /**
     * Marca o jogador ativo como "falhou" (erro ou desistência).
     * Essa marca persiste durante toda a partida.
     */
    markActivePlayerAsFailed() {
      if (this.activePlayer === 1) {
        this.p1Errored = true;
        localStorage.setItem("p1Errored", "true");
      } else {
        this.p2Errored = true;
        localStorage.setItem("p2Errored", "true");
      }
    },
    /**
     * Adiciona pontuação ao jogador ativo
     */
    addScoreToActivePlayer(points) {
      if (this.activePlayer === 1) {
        this.score1 += points;
        localStorage.setItem("score1", this.score1.toString());
      } else {
        this.score2 += points;
        localStorage.setItem("score2", this.score2.toString());
      }
      this.emitPlayoffsStateUpdate();
    },
    /**
     * Aplica a penalidade de erro (divide por 2) ao jogador ativo
     * e retorna os dados necessários para o modal de turno perdido
     */
    applyErrorPenaltyToActivePlayer() {
      let playerName;
      let newScore;

      if (this.activePlayer === 1) {
        playerName = this.player1;
        this.score1 = Math.floor(this.score1 / 2);
        newScore = this.score1;
        localStorage.setItem("score1", this.score1.toString());
      } else {
        playerName = this.player2;
        this.score2 = Math.floor(this.score2 / 2);
        newScore = this.score2;
        localStorage.setItem("score2", this.score2.toString());
      }

      this.emitPlayoffsStateUpdate();
      return { playerName, newScore };
    },
    /**
     * Troca o jogador ativo
     */
    switchActivePlayer() {
      this.activePlayer = this.activePlayer === 1 ? 2 : 1;
      localStorage.setItem("activePlayer", this.activePlayer.toString());
      this.emitPlayoffsStateUpdate();
    },
    /**
     * Marca uma ajuda como usada pelo jogador ativo
     */
    markHelpUsed(helpType) {
      if (!this.isPlayoffsMode) return;

      if (this.activePlayer === 1) {
        this.p1HelpsUsed[helpType] = true;
        localStorage.setItem("p1HelpsUsed", JSON.stringify(this.p1HelpsUsed));
      } else {
        this.p2HelpsUsed[helpType] = true;
        localStorage.setItem("p2HelpsUsed", JSON.stringify(this.p2HelpsUsed));
      }
    },
    /**
     * Define o tipo de aposta ativa para a jogada atual
     * @param {string|null} betType - "simple" | "doubled" | null
     */
    setTrucoBet(betType) {
      this.trucoBet = betType;
      localStorage.setItem("trucoBet", betType || "");
    },
    /**
     * Limpa a aposta de truco (volta ao normal)
     */
    clearTrucoBet() {
      this.trucoBet = null;
      localStorage.setItem("trucoBet", "");
    },
    /**
     * Marca que o jogador ATIVO usou seu Truco (uso único por partida)
     */
    markActivePlayerTrucoUsed() {
      if (this.activePlayer === 1) {
        this.p1TrucoUsed = true;
        localStorage.setItem("p1TrucoUsed", "true");
      } else {
        this.p2TrucoUsed = true;
        localStorage.setItem("p2TrucoUsed", "true");
      }
    },
    /**
     * Retorna os pontos a ganhar em caso de acerto,
     * considerando se há aposta de truco ativa
     */
    getPointsToWin() {
      if (this.trucoBet === "simple") {
        return PLAYOFFS_SCORING.TRUCO_SIMPLE_WIN_POINTS;
      }
      if (this.trucoBet === "doubled") {
        return PLAYOFFS_SCORING.TRUCO_DOUBLE_WIN_POINTS;
      }
      return PLAYOFFS_SCORING.NORMAL_WIN_POINTS;
    },
    /**
     * Aplica a penalidade de ERRO COM TRUCO SIMPLES ao jogador ativo:
     * perde metade dos pontos + mais 10 pontos do restante
     */
    applyTrucoSimpleErrorPenalty() {
      let playerName;
      let newScore;

      if (this.activePlayer === 1) {
        playerName = this.player1;
        this.score1 = Math.floor(this.score1 / 2);
        this.score1 = this.score1 - PLAYOFFS_SCORING.TRUCO_SIMPLE_ERROR_PENALTY;
        newScore = this.score1;
        localStorage.setItem("score1", this.score1.toString());
      } else {
        playerName = this.player2;
        this.score2 = Math.floor(this.score2 / 2);
        this.score2 = this.score2 - PLAYOFFS_SCORING.TRUCO_SIMPLE_ERROR_PENALTY;
        newScore = this.score2;
        localStorage.setItem("score2", this.score2.toString());
      }

      this.emitPlayoffsStateUpdate();
      return { playerName, newScore };
    },
    /**
     * Aplica a penalidade de ERRO COM TRUCO DOBRADO ao jogador ativo:
     * perde 20 pontos fixos
     */
    applyTrucoDoubledErrorPenalty() {
      let playerName;
      let newScore;

      if (this.activePlayer === 1) {
        playerName = this.player1;
        this.score1 =
          this.score1 - PLAYOFFS_SCORING.TRUCO_DOUBLED_ERROR_PENALTY;
        newScore = this.score1;
        localStorage.setItem("score1", this.score1.toString());
      } else {
        playerName = this.player2;
        this.score2 =
          this.score2 - PLAYOFFS_SCORING.TRUCO_DOUBLED_ERROR_PENALTY;
        newScore = this.score2;
        localStorage.setItem("score2", this.score2.toString());
      }

      this.emitPlayoffsStateUpdate();
      return { playerName, newScore };
    },
  },
};
