<template>
  <v-container fluid class="fill-height app-bg-color pa-0">
    <v-row justify="center" align="center" class="gamemode-container my-auto">
      <!-- TÍTULO DA TELA -->
      <v-col cols="12" class="text-center mb-6 white--text">
        <h1 class="text-h4 font-weight-bold">Escolha o Modo de Jogo</h1>
        <p class="subtitle-1 mt-2">
          Selecione o modo de jogo para iniciar a partida
        </p>
      </v-col>

      <!-- SELEÇÃO DOS MODOS -->
      <v-col cols="12" md="10" lg="8">
        <v-row justify="center" align="center">
          <v-col
            v-for="mode in availableModes"
            :key="mode.id"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card
              :class="['mode-card', { selected: selectedMode === mode.value }]"
              elevation="3"
              @click="selectMode(mode.value)"
            >
              <v-card-text class="pa-0">
                <span class="mode-text">{{ mode.title }}</span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- INPUTS DOS JOGADORES (EXIBIDO APENAS NO MODO PLAYOFFS) -->
      <v-col
        v-if="selectedMode === 'playoffs'"
        cols="12"
        sm="8"
        md="6"
        lg="4"
        class="mt-4"
      >
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="player1"
              label="Jogador 1"
              placeholder="Digite o nome"
              outlined
              dark
              dense
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="player2"
              label="Jogador 2"
              placeholder="Digite o nome"
              outlined
              dark
              dense
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>

      <!-- BOTÃO SELECIONAR TEMAS -->
      <v-col cols="12" class="text-center mt-8">
        <v-btn
          large
          elevation="4"
          color="white"
          class="btn-generate"
          :disabled="!canProceed"
          @click="proceedToThemes"
        >
          Selecionar Temas
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { MILLION_GAME_CONFIG } from "@/constants/gameConfig";

export default {
  name: "Gamemode",
  data() {
    return {
      availableModes: [
        { id: "playoffs", title: "PlayOffs", value: "playoffs" },
        { id: "million", title: "Corrida do Milhão", value: "million_game" },
      ],
      selectedMode: localStorage.getItem("gameMode") || "",
      player1: localStorage.getItem("player1") || "",
      player2: localStorage.getItem("player2") || "",
    };
  },
  computed: {
    canProceed() {
      if (!this.selectedMode) return false;
      if (this.selectedMode === "playoffs") {
        return this.player1.trim().length > 0 && this.player2.trim().length > 0;
      }
      return true;
    },
  },
  methods: {
    selectMode(modeValue) {
      this.selectedMode = modeValue;
    },
    proceedToThemes() {
      if (!this.canProceed) return;

      localStorage.setItem("gameMode", this.selectedMode);

      if (this.selectedMode === "playoffs") {
        localStorage.setItem("player1", this.player1.trim());
        localStorage.setItem("player2", this.player2.trim());
        localStorage.removeItem(MILLION_GAME_CONFIG.STORAGE_KEY);
      } else if (this.selectedMode === "million_game") {
        localStorage.removeItem("player1");
        localStorage.removeItem("player2");
        // Sempre inicia uma nova partida do Million Game zerada
        localStorage.setItem(MILLION_GAME_CONFIG.STORAGE_KEY, "0");
      } else {
        localStorage.removeItem("player1");
        localStorage.removeItem("player2");
        localStorage.removeItem(MILLION_GAME_CONFIG.STORAGE_KEY);
      }

      this.$router.push({ name: "Themes" });
    },
  },
};
</script>

<style scoped src="./style.css"></style>
