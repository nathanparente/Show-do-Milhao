<template>
  <div class="gold-bars-wrapper">
    <div class="gold-bar-item">
      <div class="gold-bar-label">ERRAR</div>
      <div class="gold-bar">
        <v-icon class="gold-bar-icon" color="#ffffff">mdi-gold</v-icon>
        <span class="gold-bar-text">{{ formattedErrar }}</span>
      </div>
    </div>

    <div class="gold-bar-item">
      <div class="gold-bar-label">PARAR</div>
      <div class="gold-bar">
        <v-icon class="gold-bar-icon" color="#ffffff">mdi-gold</v-icon>
        <span class="gold-bar-text">{{ formattedParar }}</span>
      </div>
    </div>

    <div class="gold-bar-item">
      <div class="gold-bar-label">ACERTAR</div>
      <div class="gold-bar">
        <v-icon class="gold-bar-icon" color="#ffffff">mdi-gold</v-icon>
        <span class="gold-bar-text">{{ formattedAcertar }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { MILLION_GAME_CONFIG } from "@/constants";

export default {
  name: "GoldBars",
  props: {
    score: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    errarValue() {
      return Math.floor(this.score / 2);
    },
    pararValue() {
      return this.score;
    },
    acertarValue() {
      return this.score + MILLION_GAME_CONFIG.QUESTION_VALUE;
    },
    formattedErrar() {
      return this.errarValue.toLocaleString("pt-BR");
    },
    formattedParar() {
      return this.pararValue.toLocaleString("pt-BR");
    },
    formattedAcertar() {
      return this.acertarValue.toLocaleString("pt-BR");
    },
  },
};
</script>

<style scoped src="./goldBars.css"></style>
