<template>
  <section v-if="currentQuestion">
    <v-row class="mt-3" justify="space-between" align="center">
      <HelpButtons
        :buttons="buttons"
        :is-last-question="isLastQuestion"
        @help-click="onHelpClick"
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
      alternatives: ["A", "B", "C", "D"],
      uiTexts: UI_TEXTS,
      buttons: [
        {
          id: "btn-cartas",
          title: "Cartas",
          icon: "mdi-cards-spade",
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
  },
  methods: {
    loadQuestion() {
      this.choice = null;
      this.color = "#efefef";

      if (this.currentQuestion && this.currentQuestion.choices) {
        this.choices = [...this.currentQuestion.choices];
      }
      // Nenhuma flag de estado do jogador precisa ser resetada aqui:
      // p1Errored/p2Errored e p1HasPlayed/p2HasPlayed valem para TODA a partida.
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
        this.color = "#57e71d";
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
        this.addScoreToActivePlayer(5);
        this.markActivePlayerHasPlayed();
        // Acertou: o MESMO jogador continua ativo, sem trocar turno
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
        // Verifica se o OUTRO jogador já jogou alguma vez em toda a partida
        // ANTES de marcar o atual e trocar o turno
        const otherPlayerAlreadyPlayed = this.hasOtherPlayerPlayedBefore();

        // Aplica a penalidade de erro no jogador atual
        const { playerName, newScore } = this.applyErrorPenaltyToActivePlayer();
        this.turnLostPlayerName = playerName;
        this.turnLostNewScore = newScore;

        this.markActivePlayerAsFailed();
        this.markActivePlayerHasPlayed();

        // Se o outro jogador JÁ jogou alguma vez -> Fim de Jogo
        if (otherPlayerAlreadyPlayed) {
          this.$router.push({ name: "gameover" });
          return;
        }

        // Outro jogador ainda não jogou nenhuma vez -> passa a vez para ele
        this.switchActivePlayer();
        this.resetHelps();
        this.turnLostDialog = true;
      } else {
        // Fluxo padrão (não-playoffs)
        this.clearGameData();
        this.replaceState();
        this.dialog = true;
      }
    },
    /**
     * Lógica do botão "Desistir"
     * Regra de negócio válida SOMENTE para o modo PlayOffs
     */
    handleGiveUp() {
      if (!this.isPlayoffsMode) return;

      // Verifica se o OUTRO jogador já jogou alguma vez em toda a partida
      // ANTES de marcar o atual e trocar o turno
      const otherPlayerAlreadyPlayed = this.hasOtherPlayerPlayedBefore();

      this.markActivePlayerAsFailed();
      this.markActivePlayerHasPlayed();

      // Se o outro jogador JÁ jogou alguma vez -> Fim de Jogo
      if (otherPlayerAlreadyPlayed) {
        this.$router.push({ name: "gameover" });
        return;
      }

      // Outro jogador ainda não jogou nenhuma vez -> passa a vez para ele
      // SEM penalidade de pontuação (desistência não reduz o placar)
      this.switchActivePlayer();
      this.resetHelps();
      this.giveUpDialog = true;
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
