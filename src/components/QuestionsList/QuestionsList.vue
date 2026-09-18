<template>
  <!-- START QUESTION LIST AREA -->
  <section v-if="currentQuestion">
    <!-- Botões de Ajudas -->
    <v-row class="mt-5" justify="space-between" align="center">
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

    <!-- Lista de Alternativas -->
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

      <!-- Alternativa Selecionada (Mantém mesmo tamanho e cor de texto) -->
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

      <!-- Alternativas Disponíveis com efeito Hover aprimorado -->
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

    <!-- Modais de Alerta e Ajuda -->
    <AlertDialog
      :dialog="dialog"
      :score="parseInt($route.params.questionId - 1)"
    />
    <HelpCard @apply-cartas="removeWrongChoices" />
  </section>
  <!-- END FIRST SECTION -->
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
  methods: {
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
        this.wrongQuestion();
      }
    },
    rightQuestion() {
      const currentId = parseInt(this.$route.params.questionId) || 1;
      if (currentId < this.questions.length) {
        this.$router.push(`/questions/${currentId + 1}`);
      } else {
        this.replaceState();
        this.$router.push("/victory");
      }
    },
    wrongQuestion() {
      this.replaceState();
      this.dialog = true;
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
      this.$store.replaceState({
        callHelp: "",
      });
    },
    ...mapMutations(["updateChartData", "updateCallHelp"]),
  },
};
</script>

<style scoped src="./style.css"></style>
