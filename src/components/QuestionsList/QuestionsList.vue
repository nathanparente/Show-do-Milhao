<template>
  <section v-if="currentQuestion">
    <v-row class="mt-3" justify="space-between" align="center">
      <v-col
        v-for="(btn, index) in buttons"
        :key="btn.id"
        justify="space-between"
        align="center"
      >
        <v-btn
          :id="btn.id"
          :disabled="isButtonDisabled(btn)"
          large
          fab
          color="white"
          @click="handleHelp(btn.id, index)"
        >
          <v-icon color="#012f6d">{{ btn.icon }}</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-row
      v-for="(item, i) in choices"
      :key="i"
      class="mt-100 mx-auto mt-5 mr-10 ml-10"
      justify="space-between"
      align="space-between"
    >
      <v-avatar class="gradient" size="62">
        <span class="headline" style="font-weight: 900">
          {{ alternatives[i] }}
        </span>
      </v-avatar>

      <v-hover v-if="choice === i" v-slot="{ hover }">
        <v-card
          rounded-8
          width="calc(100% - 80px)"
          :color="color"
          outlined
          :elevation="hover ? 12 : 2"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="title mb-1 text-wrap">
                {{ item.answer }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-hover>

      <v-hover v-else v-slot="{ hover }">
        <v-card
          rounded-8
          width="calc(100% - 80px)"
          outlined
          class="choice-card"
          :elevation="hover ? 12 : 2"
          @click="handleAnswers(i)"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="title mb-1 text-wrap">
                {{ item.answer }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-hover>
    </v-row>

    <AlertDialog
      :dialog="dialog"
      :score="parseInt($route.params.questionId - 1)"
    />
    <HelpCard @apply-cartas="removeWrongChoices" />
  </section>
</template>

<script>
import { mapMutations } from "vuex";
import { UI_TEXTS } from "@/constants/gameConfig";

export default {
  name: "QuestionsList",
  components: {
    AlertDialog: () => import("@/components/AlertDialog/AlertDialog"),
    HelpCard: () => import("@/components/HelpCard/HelpCard"),
  },
  props: {
    questions: {
      type: [Array, Object],
      default: () => [],
    },
  },
  data() {
    return {
      dialog: false,
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

      // ESTADOS DO PLAYOFFS
      gameMode: localStorage.getItem("gameMode") || "",
      player1: localStorage.getItem("player1") || "Jogador 1",
      player2: localStorage.getItem("player2") || "Jogador 2",
      score1: parseInt(localStorage.getItem("score1")) || 0,
      score2: parseInt(localStorage.getItem("score2")) || 0,
      activePlayer: parseInt(localStorage.getItem("activePlayer")) || 1,
      p1Errored: localStorage.getItem("p1Errored") === "true",
      p2Errored: localStorage.getItem("p2Errored") === "true",
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
    initPlayoffsState() {
      const qId = parseInt(this.$route.params.questionId) || 1;
      if (qId === 1 && this.gameMode === "playoffs") {
        this.score1 = 0;
        this.score2 = 0;
        this.activePlayer = 1;
        this.p1Errored = false;
        this.p2Errored = false;

        localStorage.setItem("score1", "0");
        localStorage.setItem("score2", "0");
        localStorage.setItem("activePlayer", "1");
        localStorage.setItem("p1Errored", "false");
        localStorage.setItem("p2Errored", "false");
      }
    },
    loadQuestion() {
      this.choice = null;
      this.color = "#efefef";
      if (this.currentQuestion && this.currentQuestion.choices) {
        this.choices = [...this.currentQuestion.choices];
      }
    },
    isButtonDisabled(btn) {
      if (btn.id === "btn-gepeto" && this.isLastQuestion) {
        return true;
      }
      return btn.isDisabled;
    },
    handleHelp(id, index) {
      if (this.isButtonDisabled(this.buttons[index])) return;
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
    clearGameData() {
      localStorage.removeItem("gameMode");
      localStorage.removeItem("player1");
      localStorage.removeItem("player2");
      localStorage.removeItem("score1");
      localStorage.removeItem("score2");
      localStorage.removeItem("activePlayer");
      localStorage.removeItem("p1Errored");
      localStorage.removeItem("p2Errored");
    },

    rightQuestion() {
      if (this.gameMode === "playoffs") {
        if (this.activePlayer === 1) {
          this.score1 += 5;
          localStorage.setItem("score1", this.score1.toString());
        } else {
          this.score2 += 5;
          localStorage.setItem("score2", this.score2.toString());
        }
      }

      const currentId = parseInt(this.$route.params.questionId) || 1;
      if (currentId < this.questions.length) {
        this.$router.push(`/questions/${currentId + 1}`);
      } else {
        // Fim de jogo com vitória
        this.clearGameData();
        this.replaceState();
        this.$router.push("/victory");
      }
    },
    wrongQuestion() {
      if (this.gameMode === "playoffs") {
        const otherPlayerErrored =
          this.activePlayer === 1 ? this.p2Errored : this.p1Errored;

        // Se ambos os jogadores erraram -> Fim de jogo (Derrota)
        if (otherPlayerErrored) {
          this.clearGameData();
          this.replaceState();
          this.dialog = true;
          return;
        }

        if (this.activePlayer === 1) {
          this.score1 = Math.floor(this.score1 / 2);
          this.p1Errored = true;
          localStorage.setItem("score1", this.score1.toString());
          localStorage.setItem("p1Errored", "true");
        } else {
          this.score2 = Math.floor(this.score2 / 2);
          this.p2Errored = true;
          localStorage.setItem("score2", this.score2.toString());
          localStorage.setItem("p2Errored", "true");
        }

        this.activePlayer = this.activePlayer === 1 ? 2 : 1;
        localStorage.setItem("activePlayer", this.activePlayer.toString());

        this.resetHelps();

        const currentId = parseInt(this.$route.params.questionId) || 1;
        if (currentId < this.questions.length) {
          this.$router.push(`/questions/${currentId + 1}`);
        } else {
          this.replaceState();
          this.$router.push("/victory");
        }
      } else {
        this.clearGameData();
        this.replaceState();
        this.dialog = true;
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
    },
    getUniversitariosHelp(index) {
      this.updateCallHelp("universitarios");
      this.buttons[index].isDisabled = true;
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
