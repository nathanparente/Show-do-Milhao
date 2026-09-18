<template>
  <v-row justify="center">
    <!-- START DIALOG -->
    <v-dialog :value="dialog" persistent max-width="512">
      <v-card class="modal-card">
        <v-card-title class="headline modal-title">
          Que pena, você errou! ({{ score }} / {{ totalQuestions }})
        </v-card-title>

        <v-card-text class="modal-text">
          {{ modalText }}
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
  },
  data() {
    return {
      totalQuestions: GAME_CONFIG.TOTAL_QUESTIONS,
      modalText: UI_TEXTS.LOST_GAME_MODAL_TEXT,
    };
  },
  methods: {
    wrongQuestion() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped src="./style.css"></style>
