<template>
  <v-dialog :value="showDialog" persistent max-width="520">
    <v-card class="help-modal-card">
      <v-card-title class="headline help-modal-title">
        <v-icon color="#012f6d" class="mr-2">mdi-cards-spade</v-icon>
        {{ modalTitle }}
      </v-card-title>

      <v-card-text class="help-card-container">
        <!-- FLUXO DE AJUDA: CARTAS -->
        <div v-if="helpType === 'cartas'" class="w-100">
          <!-- Estado 1: Escolha de Naipe -->
          <div v-if="!selectedSuit">
            <p class="friend-help-text mb-4">
              {{ uiTexts.HELP_CARTAS_INSTRUCTION }}
            </p>
            <v-row justify="center" align="center" class="mt-2">
              <v-col
                v-for="suit in suits"
                :key="suit.id"
                cols="6"
                sm="3"
                class="text-center"
              >
                <v-card
                  hover
                  outlined
                  class="card-suit-btn pa-3"
                  @click="pickSuit(suit)"
                >
                  <v-icon size="48" :color="suit.color">{{ suit.icon }}</v-icon>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <!-- Estado 2: Carta Revelada -->
          <div v-else class="text-center">
            <v-icon size="64" :color="selectedSuit.color" class="mb-2">
              {{ selectedSuit.icon }}
            </v-icon>
            <p class="cartas-result-text">
              <span v-if="selectedVal === 4">
                {{ uiTexts.HELP_CARTAS_NONE }}
              </span>
              <span v-else-if="selectedVal === 1">
                {{ uiTexts.HELP_CARTAS_ONE_OPTION }}
              </span>
              <span v-else>
                {{ selectedVal }} {{ uiTexts.HELP_CARTAS_SELECTED_OPTIONS }}
              </span>
            </p>
          </div>
        </div>

        <!-- FLUXO DE AJUDA: GEPETO -->
        <div v-else-if="helpType === 'gepeto'">
          <p class="friend-help-text mb-2">
            {{ uiTexts.HELP_GEPETO }}
          </p>
          <p class="gepeto-answer-text">"{{ gepetoAnswer }}"</p>
        </div>

        <!-- FLUXO DE AJUDA: UNIVERSITÁRIOS -->
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p
          v-else-if="helpType === 'universitarios'"
          class="friend-help-text"
          v-html="uiTexts.HELP_UNIVERSITARIOS"
        ></p>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-if="helpType !== 'cartas' || selectedSuit"
          color="#012f6d"
          text
          class="modal-btn"
          @click="closeModal"
        >
          Entendido
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { UI_TEXTS } from "@/constants";

export default {
  name: "HelpCard",
  data() {
    return {
      uiTexts: UI_TEXTS,
      suits: [
        {
          id: "spades",
          name: "Espadas",
          icon: "mdi-cards-spade",
          color: "black",
        },
        {
          id: "hearts",
          name: "Copas",
          icon: "mdi-cards-heart",
          color: "red darken-2",
        },
        {
          id: "diamonds",
          name: "Ouros",
          icon: "mdi-cards-diamond",
          color: "red darken-2",
        },
        { id: "clubs", name: "Paus", icon: "mdi-cards-club", color: "black" },
      ],
      suitValues: {},
      selectedSuit: null,
      selectedVal: null,
    };
  },
  computed: {
    ...mapState({
      callHelp: (state) => state.callHelp,
    }),
    helpType() {
      if (typeof this.callHelp === "object" && this.callHelp !== null) {
        return this.callHelp.type;
      }
      return this.callHelp;
    },
    gepetoAnswer() {
      if (typeof this.callHelp === "object" && this.callHelp !== null) {
        return this.callHelp.answer || "";
      }
      return "";
    },
    modalTitle() {
      if (this.helpType === "cartas") return "Jogo das Cartas";
      return "Ajuda do Jogo";
    },
    showDialog() {
      return (
        this.helpType === "gepeto" ||
        this.helpType === "universitarios" ||
        this.helpType === "cartas"
      );
    },
  },
  watch: {
    helpType(newVal) {
      if (newVal === "cartas") {
        this.generateSuitValues();
      }
    },
  },
  methods: {
    ...mapMutations(["updateCallHelp"]),
    generateSuitValues() {
      this.selectedSuit = null;
      this.selectedVal = null;

      // Sorteia os números de 1 a 4 de forma única e aleatória
      const numbers = [1, 2, 3, 4].sort(() => Math.random() - 0.5);
      this.suitValues = {
        spades: numbers[0],
        hearts: numbers[1],
        diamonds: numbers[2],
        clubs: numbers[3],
      };
    },
    pickSuit(suit) {
      this.selectedSuit = suit;
      this.selectedVal = this.suitValues[suit.id];
      this.$emit("apply-cartas", this.selectedVal);
    },
    closeModal() {
      this.updateCallHelp("");
    },
  },
};
</script>

<style scoped src="./style.css"></style>
