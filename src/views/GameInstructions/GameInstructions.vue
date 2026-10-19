<template>
  <v-container fluid class="fill-height app-bg-color pa-0">
    <v-row
      justify="center"
      align="center"
      class="instructions-container my-auto"
    >
      <!-- TÍTULO DA TELA -->
      <v-col cols="12" class="text-center mb-4 white--text">
        <h1 class="text-h4 font-weight-bold">
          {{ uiTexts.INSTRUCTIONS_TITLE }}
        </h1>
        <p class="subtitle-1 mt-2">{{ uiTexts.INSTRUCTIONS_SUBTITLE }}</p>
      </v-col>

      <!-- CARROSSEL (com setas e pause) -->
      <v-col cols="12" class="d-flex justify-center px-4">
        <InstructionsCarousel />
      </v-col>

      <!-- BOTÃO DE AÇÃO -->
      <v-col cols="12" class="text-center mt-6">
        <v-btn
          large
          elevation="4"
          color="white"
          class="btn-generate"
          @click="goBack"
        >
          {{ uiTexts.INSTRUCTIONS_BUTTON }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { UI_TEXTS } from "@/constants";
import InstructionsCarousel from "@/components/InstructionsCarousel/InstructionsCarousel";

export default {
  name: "GameInstructions",
  components: { InstructionsCarousel },
  data() {
    return {
      uiTexts: UI_TEXTS,
    };
  },
  methods: {
    goBack() {
      this.$router.back();
    },
  },
};
</script>

<style scoped src="./style.css"></style>
