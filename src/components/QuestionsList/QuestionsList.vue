<template>
  <!-- START QUESTION LIST AREA -->
  <section>
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
    <v-row
      v-for="(item, i) in choices"
      :key="i"
      class="mt-100 mx-auto mt-5 mr-10 ml-10"
      justify="space-between"
      align="space-between"
    >
      <v-avatar class="gradient" size="62">
        <span
          class="headline"
          style="
             {
              font-weight: 900;
            }
          "
          >{{ alternatives[i] }}</span
        >
      </v-avatar>
      <v-hover v-if="choice == i" v-slot="{ hover }">
        <v-card
          rounded-8
          width="calc(100% - 80px)"
          :color="color"
          outlined
          :elevation="hover ? 12 : 2"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="headline mb-1">
                {{ item.answer }}</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-hover>
      <v-hover v-else="" v-slot="{ hover }">
        <v-card
          rounded-8
          width="calc(100% - 80px)"
          outlined
          :elevation="hover ? 12 : 2"
          @click="handleAnswers(i)"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="headline mb-1">
                {{ item.answer }}</v-list-item-title
              >
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
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    AlertDialog: () => import("@/components/AlertDialog/AlertDialog"),
  },
  props: {
    questions: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      id: 0,
      onCallHelp: null,
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
      choices: {},
      choice: null,
      color: "#efefef",
    };
  },

  created() {
    this.loadQuestion(); // Carrega a pergunta com base na nova ordem
  },

  methods: {
    loadQuestion() {
      // Carrega a pergunta atual com base no ID
      this.choices = this.questions[this.$route.params.questionId].choices;
    },
    handleAnswers: function (index) {
      /**
       * @param {Int} index,
       * Função responsável realizar o controle das respostas escolhidas pelo usuário
       */
      this.choice = index;
      if (this.choices[index].isTrue) {
        this.color = "#57e71d";
        setTimeout(() => {
          this.rightQuestion(index);
        }, 1000);
      } else {
        this.color = "#f60808";
        this.wrongQuestion();
      }
    },

    rightQuestion: function () {
      var next = parseInt(this.$route.params.questionId) + 1;
      this.choice = null;
      if (next < this.questions.length) {
        this.$router.push(`/questions/${next}`); // Redireciona para a próxima pergunta
      } else {
        // Lógica para finalizar o jogo ou mostrar resultados
      }
      this.loadQuestion(); // Carrega a próxima pergunta
    },

    wrongQuestion: function () {
      /**
       * Função responsável por finalizar o jogo, caso escolha-se a resposta errada
       */
      this.replaceState();
      this.dialog = true;
    },

    getHalf: function (index) {
      /**
       * @param {Int} index,
       * Função responsável por reduzir as opções pela metade
       */
      var next = parseInt(this.$route.params.questionId) + 1;
      this.choice = null;
      var choices = this.questions[next - 2].choices;
      var temp = [];
      choices.forEach((element) => {
        if (element.isOnHalf) {
          temp.push(element);
        }
      });
      this.choices = temp;
      this.buttons[index].isDisabled = true;
    },

    getCallHelp: function (index) {
      /**
       * @param {Int} index,
       * Função responsável obter a resposta sugerida pela ligação e salva-la no state do Vuex
       */
      var next = parseInt(this.$route.params.questionId) + 1;
      this.choice = null;
      var choices = this.questions[next - 2].choices;
      var temp;
      choices.forEach((element) => {
        if (element.isOnCallHelp) {
          temp = element.answer;
        }
      });
      this.updateCallHelp(temp);
      this.buttons[index].isDisabled = true;
    },

    getProbability: function (index) {
      /**
       * @param {Int} index,
       * Função responsável obter as respostas sugeridas pela platéia e salva-las no state do Vuex
       */
      var next = parseInt(this.$route.params.questionId) + 1;
      this.choice = null;
      var choices = this.questions[next - 2].choices;
      var temp = [];
      temp = [
        ["Alternativas", "Porcentagem de votos da platéia"],
        ["A", choices[0].probability],
        ["B", choices[1].probability],
        ["C", choices[2].probability],
        ["D", choices[3].probability],
      ];
      this.updateChartData(temp);
      this.buttons[index].isDisabled = true;
    },

    replaceState: function () {
      /**
       * Função responsável por restaurar os padrões dos estados do Vuex
       */
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

<style></style>
