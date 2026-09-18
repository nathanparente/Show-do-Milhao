<template>
  <section v-if="currentQuestion">
    <v-row class="mt-3" justify="space-between" align="center">
      <HelpButtons
        :buttons="buttons"
        :is-last-question="isLastQuestion"
        :show-truco="isPlayoffsMode"
        :is-truco-disabled="trucoButtonDisabled"
        @help-click="onHelpClick"
        @truco-click="handleTrucoClick"
      />
      <GiveUpButton :show="isPlayoffsMode" @give-up="handleGiveUp" />
    </v-row>

    <ChoicesList
      :choices="choices"
      :choice="choice"
      :color="color"
      :alternatives="alternatives"
      @select="handleAnswers"
    />

    <AlertDialog
      :dialog="dialog"
      :score="parseInt($route.params.questionId - 1)"
    />
    <HelpCard @apply-cartas="removeWrongChoices" />
    <TurnLostDialog
      :dialog="turnLostDialog"
      :player-name="turnLostPlayerName"
      :new-score="turnLostNewScore"
      @continue="proceedAfterTurnLost"
    />
    <GiveUpDialog :dialog="giveUpDialog" @continue="proceedAfterGiveUp" />

    <!-- Modal do Truco -->
    <TrucoDialog
      :dialog="trucoDialog"
      @accept="handleTrucoAccept"
      @double-down="handleTrucoDoubleDown"
    />
  </section>
</template>

<script>
import { mapMutations } from "vuex";
import { UI_TEXTS } from "@/constants/gameConfig";
import playoffsMixin from "./mixins/playoffsMixin";
import HelpButtons from "./components/HelpButtons.vue";
import GiveUpButton from "./components/GiveUpButton.vue";
import ChoicesList from "./components/ChoicesList.vue";

export default {
  name: "QuestionsList",
  components: {
    HelpButtons,
    GiveUpButton,
    ChoicesList,
    AlertDialog: () => import("@/components/AlertDialog/AlertDialog"),
    HelpCard: () => import("@/components/HelpCard/HelpCard"),
    TurnLostDialog: () => import("@/components/TurnLostDialog/TurnLostDialog"),
    GiveUpDialog: () => import("@/components/GiveUpDialog/GiveUpDialog"),
    TrucoDialog: () =>
      import("@/components/QuestionsList/components/TrucoDialog.vue"),
  },
  mixins: [playoffsMixin],
  props: {
    questions: {
      type: [Array, Object],
      default: () => [],
    },
  },
  data() {
    return {
      dialog: false,
      turnLostDialog: false,
      turnLostPlayerName: "",
      turnLostNewScore: 0,
      giveUpDialog: false,
      trucoDialog: false,
      alternatives: ["A", "B", "C", "D"],
      uiTexts: UI_TEXTS,
      buttons: [
        {
          id: "btn-cartas",
          title: "Cartas",
          icon: "mdi-cards-playing-spade-multiple",
          isDisabled: false,
        },
        {
          id: "btn-gepeto",
          title: "Gepeto",
          icon: "mdi-robot",
          isDisabled: false,
        },
        {
          id: "btn-universitarios",
          title: "Universitários",
          icon: "mdi-account-group",
          isDisabled: false,
        },
      ],
      choices: [],
      choice: null,
      color: "#efefef",
    };
  },
  computed: {
    currentIndex() {
      const qId = parseInt(this.$route.params.questionId) || 1;
      return Math.max(0, qId - 1);
    },
    currentQuestion() {
      if (Array.isArray(this.questions) && this.questions.length > 0) {
        return this.questions[this.currentIndex] || null;
      }
      return null;
    },
    isLastQuestion() {
      return (
        Array.isArray(this.questions) &&
        this.questions.length > 0 &&
        this.currentIndex === this.questions.length - 1
      );
    },
    /**
     * O botão Truco fica desabilitado se já houver uma aposta ativa
     * na jogada atual (simples ou dobrada)
     */
    trucoButtonDisabled() {
      return !!this.trucoBet || this.hasActivePlayerUsedTruco;
    },
  },
  watch: {
    "$route.params.questionId"() {
      this.loadQuestion();
    },
    questions: {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.loadQuestion();
        }
      },
    },
  },
  created() {
    this.initPlayoffsState();
    this.emitPlayoffsStateUpdate(); // garante que o pai receba o estado inicial ao montar
  },
  methods: {
    loadQuestion() {
      this.choice = null;
      this.color = "#efefef";

      if (this.currentQuestion && this.currentQuestion.choices) {
        this.choices = [...this.currentQuestion.choices];
      }
    },
    onHelpClick({ id, index }) {
      this.handleHelp(id, index);
    },
    handleHelp(id, index) {
      if (this.buttons[index].isDisabled) return;
      if (id === "btn-cartas") {
        this.getCartasHelp(index);
      } else if (id === "btn-gepeto") {
        this.getGepetoHelp(index);
      } else if (id === "btn-universitarios") {
        this.getUniversitariosHelp(index);
      }
    },
    handleAnswers(index) {
      this.choice = index;
      if (this.choices[index].isTrue) {
        this.color = "#57e71d"; // Verde
        setTimeout(() => {
          this.rightQuestion();
        }, 1000);
      } else {
        this.color = "#f60808";
        setTimeout(() => {
          this.wrongQuestion();
        }, 1000);
      }
    },
    rightQuestion() {
      if (this.isPlayoffsMode) {
        const points = this.getPointsToWin();
        this.addScoreToActivePlayer(points);
        this.markActivePlayerHasPlayed();

        // O efeito do Truco (simple OU doubled) vale SOMENTE para esta pergunta.
        // Sempre limpamos ao resolver, independente do tipo de aposta.
        this.clearTrucoBet();
      }

      const currentId = parseInt(this.$route.params.questionId) || 1;
      if (currentId < this.questions.length) {
        this.$router.push(`/questions/${currentId + 1}`);
      } else {
        this.clearGameData();
        this.replaceState();
        this.$router.push("/victory");
      }
    },
    wrongQuestion() {
      if (this.isPlayoffsMode) {
        const otherPlayerAlreadyPlayed = this.hasOtherPlayerPlayedBefore();

        let playerName;
        let newScore;

        if (this.trucoBet === "simple") {
          const result = this.applyTrucoSimpleErrorPenalty();
          playerName = result.playerName;
          newScore = result.newScore;
        } else if (this.trucoBet === "doubled") {
          const result = this.applyTrucoDoubledErrorPenalty();
          playerName = result.playerName;
          newScore = result.newScore;
        } else {
          const result = this.applyErrorPenaltyToActivePlayer();
          playerName = result.playerName;
          newScore = result.newScore;
        }

        this.turnLostPlayerName = playerName;
        this.turnLostNewScore = newScore;

        this.markActivePlayerAsFailed();
        this.markActivePlayerHasPlayed();

        // O efeito do Truco vale SOMENTE para esta pergunta - sempre limpa
        this.clearTrucoBet();

        if (otherPlayerAlreadyPlayed) {
          this.$router.push({ name: "gameover" });
          return;
        }

        this.switchActivePlayer();
        this.resetHelps();
        this.turnLostDialog = true;
      } else {
        this.clearGameData();
        this.replaceState();
        this.dialog = true;
      }
    },
    handleGiveUp() {
      if (!this.isPlayoffsMode) return;

      const otherPlayerAlreadyPlayed = this.hasOtherPlayerPlayedBefore();

      this.markActivePlayerAsFailed();
      this.markActivePlayerHasPlayed();
      this.clearTrucoBet();

      if (otherPlayerAlreadyPlayed) {
        this.$router.push({ name: "gameover" });
        return;
      }

      this.switchActivePlayer();
      this.resetHelps();
      this.giveUpDialog = true;
    },
    /**
     * Abre o modal do Truco
     */
    handleTrucoClick() {
      if (!this.isPlayoffsMode) return;
      if (this.trucoBet) return; // já há aposta ativa nesta pergunta
      if (this.hasActivePlayerUsedTruco) return; // já usou seu truco na partida
      this.trucoDialog = true;
    },
    /**
     * Jogador ACEITA o truco: joga a PERGUNTA ATUAL com risco/prêmio dobrado.
     * Consome o uso único do Truco desse jogador.
     */
    handleTrucoAccept() {
      this.trucoDialog = false;
      this.markActivePlayerTrucoUsed();
      this.setTrucoBet("simple");
    },
    /**
     * Jogador DOBRA A APOSTA: encerra o turno sem jogar,
     * mantém pontuação intacta, passa a vez para o próximo jogador
     * que jogará sob risco/prêmio dobrado até errar ou desistir
     */
    handleTrucoDoubleDown() {
      this.trucoDialog = false;

      this.markActivePlayerTrucoUsed();
      this.markActivePlayerHasPlayed();
      this.switchActivePlayer();
      this.resetHelps();
      this.setTrucoBet("doubled");

      this.choice = null;
      this.color = "#efefef";
    },
    proceedAfterGiveUp() {
      this.giveUpDialog = false;
      const currentId = parseInt(this.$route.params.questionId) || 1;
      if (currentId < this.questions.length) {
        this.$router.push(`/questions/${currentId + 1}`);
      } else {
        this.$router.push({ name: "gameover" });
      }
    },
    proceedAfterTurnLost() {
      this.turnLostDialog = false;
      const currentId = parseInt(this.$route.params.questionId) || 1;
      if (currentId < this.questions.length) {
        this.$router.push(`/questions/${currentId + 1}`);
      } else {
        this.$router.push({ name: "gameover" });
      }
    },
    resetHelps() {
      this.buttons.forEach((btn) => {
        btn.isDisabled = false;
      });
      this.replaceState();
    },
    getCartasHelp(index) {
      this.updateCallHelp("cartas");
      this.buttons[index].isDisabled = true;
      this.markHelpUsed("cartas");
    },
    getGepetoHelp(index) {
      if (!this.currentQuestion) return;
      const respostaCorreta = this.currentQuestion.choices.find(
        (item) => item.isTrue
      );
      this.updateCallHelp({
        type: "gepeto",
        answer: respostaCorreta ? respostaCorreta.answer : "",
      });
      this.buttons[index].isDisabled = true;
      this.markHelpUsed("gepeto");
    },
    getUniversitariosHelp(index) {
      this.updateCallHelp("universitarios");
      this.buttons[index].isDisabled = true;
      this.markHelpUsed("universitarios");
    },
    removeWrongChoices(count) {
      if (!this.currentQuestion || !this.choices) return;
      const wrongChoices = this.choices.filter((item) => !item.isTrue);
      const numToRemove =
        count === 4 ? 0 : Math.min(count, wrongChoices.length);
      if (numToRemove === 0) return;
      const shuffledWrong = [...wrongChoices].sort(() => Math.random() - 0.5);
      const wrongToKeep = shuffledWrong.slice(numToRemove);
      this.choices = this.choices.filter(
        (item) => item.isTrue || wrongToKeep.includes(item)
      );
    },
    replaceState() {
      this.$store.replaceState({ callHelp: "" });
    },

    ...mapMutations(["updateChartData", "updateCallHelp"]),
  },
};
</script>

<style scoped src="./style.css"></style>
