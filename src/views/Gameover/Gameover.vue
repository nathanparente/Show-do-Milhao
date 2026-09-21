<template>
  <v-container fluid class="fill-height app-bg-color pa-0">
    <v-row justify="center" align="center" class="gamemode-container my-auto">
      <!-- TÍTULO DA TELA -->
      <v-col cols="12" class="text-center mb-6 white--text">
        <h1 class="text-h4 font-weight-bold">Fim de Jogo</h1>
        <p class="subtitle-1 mt-2">Confira o resultado final da partida</p>
      </v-col>

      <!-- RANKING DOS JOGADORES -->
      <v-col cols="12" md="10" lg="8">
        <v-row justify="center">
          <v-col
            v-for="(player, index) in rankedPlayers"
            :key="player.id"
            cols="12"
            sm="6"
            md="5"
          >
            <v-card
              :class="['ranking-card', { winner: index === 0 && !isTie }]"
              elevation="3"
            >
              <!-- Selo de posição -->
              <div class="rank-badge">
                <v-icon v-if="index === 0 && !isTie" color="#ffd700" large>
                  mdi-crown
                </v-icon>
                <span v-else class="rank-number">{{ index + 1 }}º</span>
              </div>

              <v-card-text class="text-center pa-4">
                <h2 class="player-name mb-1">{{ player.name }}</h2>
                <p class="player-score mb-4">{{ player.score }} pontos</p>

                <v-divider class="mb-4" />

                <h3 class="helps-title mb-3">Ajudas Utilizadas</h3>

                <v-row justify="space-around" no-gutters>
                  <v-col
                    v-for="help in player.helps"
                    :key="help.key"
                    cols="4"
                    class="text-center"
                  >
                    <v-icon
                      :color="help.used ? '#57e71d' : '#bdbdbd'"
                      size="32"
                    >
                      {{ help.used ? "mdi-check-circle" : "mdi-minus-circle" }}
                    </v-icon>
                    <p class="help-label mt-1">{{ help.label }}</p>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- BOTÃO VOLTAR AO MENU -->
      <v-col cols="12" class="text-center mt-8">
        <v-btn
          large
          elevation="4"
          color="white"
          class="btn-generate"
          @click="backToMenu"
        >
          Voltar ao Início
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Gameover",
  data() {
    return {
      player1: localStorage.getItem("player1") || "Jogador 1",
      player2: localStorage.getItem("player2") || "Jogador 2",
      score1: parseInt(localStorage.getItem("score1")) || 0,
      score2: parseInt(localStorage.getItem("score2")) || 0,
      p1HelpsUsed: JSON.parse(localStorage.getItem("p1HelpsUsed")) || {
        cartas: false,
        gepeto: false,
        universitarios: false,
      },
      p2HelpsUsed: JSON.parse(localStorage.getItem("p2HelpsUsed")) || {
        cartas: false,
        gepeto: false,
        universitarios: false,
      },
    };
  },
  computed: {
    isTie() {
      return this.score1 === this.score2;
    },
    rankedPlayers() {
      const players = [
        {
          id: 1,
          name: this.player1,
          score: this.score1,
          helps: this.buildHelpsList(this.p1HelpsUsed),
        },
        {
          id: 2,
          name: this.player2,
          score: this.score2,
          helps: this.buildHelpsList(this.p2HelpsUsed),
        },
      ];

      // Ordena do maior para o menor placar
      return players.sort((a, b) => b.score - a.score);
    },
  },
  created() {
    // Após capturar os dados necessários para exibição,
    // limpamos o localStorage para não deixar dados de partidas antigas
    this.clearGameData();
  },
  methods: {
    buildHelpsList(helpsUsedObj) {
      return [
        { key: "cartas", label: "Cartas", used: !!helpsUsedObj.cartas },
        { key: "gepeto", label: "Gepeto", used: !!helpsUsedObj.gepeto },
        {
          key: "universitarios",
          label: "Universitários",
          used: !!helpsUsedObj.universitarios,
        },
      ];
    },
    clearGameData() {
      localStorage.removeItem("gameMode");
      localStorage.removeItem("player1");
      localStorage.removeItem("player2");
      localStorage.removeItem("score1");
      localStorage.removeItem("score2");
      localStorage.removeItem("activePlayer");
      localStorage.removeItem("p1Errored");
      localStorage.removeItem("p2Errored");
      localStorage.removeItem("p1Played");
      localStorage.removeItem("p2Played");
      localStorage.removeItem("p1HelpsUsed");
      localStorage.removeItem("p2HelpsUsed");
    },
    backToMenu() {
      this.$router.push({ name: "Gamemode" });
    },
  },
};
</script>

<style scoped src="./style.css"></style>
