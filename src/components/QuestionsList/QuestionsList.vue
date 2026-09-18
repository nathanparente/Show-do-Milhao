<template>
  <!-- START QUESTION LIST AREA -->
  <section v-if="currentQuestion">
    <!-- Botões de Ajudas -->
    <v-row class="mt-5" justify="space-between" align="space-between">
      <v-col justify="space-between" align="space-between">
        <v-btn
          :disabled="buttons[0].isDisabled"
          large
          fab
          color="white"
          @click="getHalf(0)"
        >
          <v-icon>{{ buttons[0].icon }}</v-icon>
        </v-btn>
      </v-col>
      <v-col justify="space-between" align="space-between">
        <v-btn
          :disabled="buttons[1].isDisabled"
          large
          fab
          color="white"
          @click="getCallHelp(1)"
        >
          <v-icon>{{ buttons[1].icon }}</v-icon>
        </v-btn>
      </v-col>
      <v-col justify="space-between" align="space-between">
        <v-btn
          :disabled="buttons[2].isDisabled"
          large
          fab
          color="white"
          @click="getProbability(2)"
        >
          <v-icon>{{ buttons[2].icon }}</v-icon>
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

      <!-- Alternativa Selecionada -->
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
              <v-list-item-title class="headline mb-1 white--text text-wrap">
                {{ item.answer }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-hover>

      <!-- Alternativas Disponíveis -->
      <v-hover v-else v-slot="{ hover }">
        <v-card
          rounded-8
          width="calc(100% - 80px)"
          outlined
          :elevation="hover ? 12 : 2"
          @click="handleAnswers(i)"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="headline mb-1 text-wrap">
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
  </section>
  <!-- END FIRST SECTION -->
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "QuestionsList",
  components: {
    AlertDialog: () => import("@/components/AlertDialog/AlertDialog"),
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
      buttons: [
        {
          title: "50/50",
          icon: "mdi-circle-half-full",
          isDisabled: false,
        },
        {
          title: "Ligar por Ajuda",
          icon: "mdi-card-account-phone-outline",
          isDisabled: false,
        },
        {
          title: "Ajuda da Platéia",
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
        alert(
          "🎉 PARABÉNS! Você respondeu todas as perguntas do Show do Milhão!"
        );
        this.replaceState();
        this.$router.push("/");
      }
    },
    wrongQuestion() {
      this.replaceState();
      this.dialog = true;
    },
    getHalf(index) {
      if (!this.currentQuestion) return;
      this.choices = this.currentQuestion.choices.filter(
        (item) => item.isOnHalf
      );
      this.buttons[index].isDisabled = true;
    },
    getCallHelp(index) {
      if (!this.currentQuestion) return;
      const suggested = this.currentQuestion.choices.find(
        (item) => item.isOnCallHelp
      );
      if (suggested) {
        this.updateCallHelp(suggested.answer);
      }
      this.buttons[index].isDisabled = true;
    },
    getProbability(index) {
      if (!this.currentQuestion) return;
      const choices = this.currentQuestion.choices;
      const temp = [
        ["Alternativas", "Porcentagem de votos da platéia"],
        ["A", choices[0] ? choices[0].probability : 0],
        ["B", choices[1] ? choices[1].probability : 0],
        ["C", choices[2] ? choices[2].probability : 0],
        ["D", choices[3] ? choices[3].probability : 0],
      ];
      this.updateChartData(temp);
      this.buttons[index].isDisabled = true;
    },
    replaceState() {
      this.$store.replaceState({
        chartData: [
          ["Alternativas", "Porcentagem de votos da platéia"],
          ["A", 0],
          ["B", 0],
          ["C", 0],
          ["D", 0],
        ],
        callHelp: "",
      });
    },
    ...mapMutations(["updateChartData", "updateCallHelp"]),
  },
};
</script>

<style scoped src="./style.css"></style>
