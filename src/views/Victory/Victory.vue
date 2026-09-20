<template>
  <v-container fluid class="fill-height app-victory-bg-color pa-0">
    <v-row justify="center" align="center" class="victory-container my-auto">
      <v-col cols="12" class="text-center white--text pa-4">
        <v-img
          src="@/assets/images/bg/llama-winner.gif"
          max-width="800"
          max-height="400"
          contain
          class="mx-auto mb-6"
        ></v-img>

        <h1 class="win-message mb-8">
          {{ uiTexts.WIN_MESSAGE }}
        </h1>

        <v-btn
          large
          elevation="4"
          color="white"
          class="btn-restart"
          @click="restartGame"
        >
          Reiniciar jogo
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { UI_TEXTS } from "@/constants/gameConfig";

export default {
  name: "Victory",
  data() {
    return {
      uiTexts: UI_TEXTS,
    };
  },
  methods: {
    restartGame() {
      this.$store.replaceState({
        callHelp: "",
      });
      this.$router.push("/");
    },
  },
};
</script>

<style scoped src="./style.css"></style>
