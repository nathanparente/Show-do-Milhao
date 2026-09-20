<template>
  <v-dialog :value="showDialog" persistent max-width="500">
    <v-card class="help-modal-card">
      <v-card-title class="headline help-modal-title">
        <v-icon color="#012f6d" class="mr-2">mdi-lightbulb-on-outline</v-icon>
        Ajuda do Jogo
      </v-card-title>

      <v-card-text class="help-card-container">
        <!-- Exibição da ajuda do Gepeto -->
        <p v-if="callHelp === 'gepeto'" class="friend-help-text">
          {{ uiTexts.HELP_GEPETO }}
        </p>

        <!-- Exibição da ajuda dos Universitários -->
        <p
          v-else-if="callHelp === 'universitarios'"
          class="friend-help-text"
          v-html="uiTexts.HELP_UNIVERSITARIOS"
        ></p>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#012f6d" text class="modal-btn" @click="closeModal">
          Entendido
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { UI_TEXTS } from "@/constants/gameConfig";

export default {
  name: "HelpCard",
  data() {
    return {
      uiTexts: UI_TEXTS,
    };
  },
  computed: {
    ...mapState({
      callHelp: (state) => state.callHelp,
    }),
    showDialog() {
      return this.callHelp === "gepeto" || this.callHelp === "universitarios";
    },
  },
  methods: {
    ...mapMutations(["updateCallHelp"]),
    closeModal() {
      this.updateCallHelp("");
    },
  },
};
</script>

<style scoped src="./style.css"></style>
