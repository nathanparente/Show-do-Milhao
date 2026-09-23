/**
 * Mixin responsável pela lógica do botão de "Pulo".
 * Funciona tanto no modo PlayOffs quanto no Corrida do Milhão.
 *
 * Regras:
 * - Máximo de 3 pulos por jogador.
 * - No PlayOffs, o contador é POR JOGADOR e reseta ao trocar de turno.
 * - No Million Game, o contador é único (não há troca de turno).
 * - Os dados ficam salvos no localStorage e são limpos no fim do jogo
 *   (e no fim do turno do jogador, no caso do PlayOffs).
 */
export default {
  data() {
    return {
      p1SkipsUsed: parseInt(localStorage.getItem("p1SkipsUsed")) || 0,
      p2SkipsUsed: parseInt(localStorage.getItem("p2SkipsUsed")) || 0,
      millionSkipsUsed: parseInt(localStorage.getItem("millionSkipsUsed")) || 0,
    };
  },
  computed: {
    /**
     * Quantidade de pulos já utilizados pelo jogador/contexto atual
     */
    currentSkipsUsed() {
      if (this.gameMode === "playoffs") {
        return this.activePlayer === 1 ? this.p1SkipsUsed : this.p2SkipsUsed;
      }
      return this.millionSkipsUsed;
    },
    /**
     * Quantidade de pulos ainda disponíveis (máx. 3)
     */
    skipsRemaining() {
      return Math.max(0, 3 - this.currentSkipsUsed);
    },
    /**
     * Quantidade de perguntas restantes, incluindo a atual
     */
    questionsRemainingCount() {
      if (!Array.isArray(this.questions) || this.questions.length === 0) {
        return 0;
      }
      return this.questions.length - this.currentIndex;
    },
    /**
     * Regra central de desabilitação do botão de pulo
     */
    isSkipDisabled() {
      const remaining = this.questionsRemainingCount;

      // Última pergunta: sempre desabilitado
      if (remaining <= 1) return true;

      // Sem pulos disponíveis
      if (this.skipsRemaining <= 0) return true;

      // 3 últimas perguntas + 3 pulos disponíveis
      // 2 últimas perguntas + 2 ou 3 pulos disponíveis
      if (this.skipsRemaining >= remaining) return true;

      return false;
    },
  },
  methods: {
    /**
     * Incrementa o contador de pulos do jogador/contexto atual
     */
    incrementSkipCount() {
      if (this.gameMode === "playoffs") {
        if (this.activePlayer === 1) {
          this.p1SkipsUsed += 1;
          localStorage.setItem("p1SkipsUsed", this.p1SkipsUsed.toString());
        } else {
          this.p2SkipsUsed += 1;
          localStorage.setItem("p2SkipsUsed", this.p2SkipsUsed.toString());
        }
      } else {
        this.millionSkipsUsed += 1;
        localStorage.setItem(
          "millionSkipsUsed",
          this.millionSkipsUsed.toString()
        );
      }
    },
    /**
     * Reseta o contador de pulos do jogador ATIVO.
     * Deve ser chamado ANTES de trocar o turno (switchActivePlayer),
     * pois o reset é referente a quem está encerrando a jogada.
     */
    resetActivePlayerSkips() {
      if (this.gameMode !== "playoffs") return;
      if (this.activePlayer === 1) {
        this.p1SkipsUsed = 0;
        localStorage.setItem("p1SkipsUsed", "0");
      } else {
        this.p2SkipsUsed = 0;
        localStorage.setItem("p2SkipsUsed", "0");
      }
    },
    /**
     * Limpa todos os dados de pulo (fim de jogo)
     */
    clearSkipData() {
      this.p1SkipsUsed = 0;
      this.p2SkipsUsed = 0;
      this.millionSkipsUsed = 0;
      localStorage.removeItem("p1SkipsUsed");
      localStorage.removeItem("p2SkipsUsed");
      localStorage.removeItem("millionSkipsUsed");
    },
  },
};
