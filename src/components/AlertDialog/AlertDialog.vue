<template>
  <v-row justify="center">
    <!-- START DIALOG -->
    <v-dialog :value="dialog" persistent max-width="512">
      <v-card class="modal-card">
        <v-card-title class="headline modal-title">
          FIM DE JOGO! ({{ score }} / {{ totalQuestions }})
        </v-card-title>

        <v-card-text class="modal-text">
          {{ modalText }}
        </v-card-text>

        <v-card-text v-if="isMillionMode" class="modal-million-score">
          <v-icon color="#d4a017" class="mr-1">mdi-gold</v-icon>
          {{ lostMillionGame }}
          <strong>{{ formattedMillionScore }}</strong>
          acumulados
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            class="modal-btn"
            @click="wrongQuestion"
          >
            Recomeçar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- END DIALOG -->
  </v-row>
</template>

<script>
import { GAME_CONFIG, UI_TEXTS } from "@/constants/gameConfig";

export default {
  name: "AlertDialog",
  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false,
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    isMillionMode: {
      type: Boolean,
      default: false,
    },
    finalMillionScore: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      totalQuestions: GAME_CONFIG.TOTAL_QUESTIONS,
      modalText: UI_TEXTS.LOST_GAME_MODAL_TEXT,
      lostMillionGame: UI_TEXTS.LOST_MILLION_GAME_TEXT,
    };
  },
  computed: {
    formattedMillionScore() {
      return this.finalMillionScore.toLocaleString("pt-BR");
    },
  },
  methods: {
    wrongQuestion() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped src="./style.css"></style>
