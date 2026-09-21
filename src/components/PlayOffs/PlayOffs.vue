<template>
  <div class="playoffs-wrapper">
    <v-row align="center" justify="space-between" class="ma-0 w-100">
      <!-- CANTO ESQUERDO: Botão Home (slot) + Jogador 1 -->
      <div class="d-flex align-center">
        <slot name="left-action" />

        <div :class="['player-box', { disabled: activePlayer !== 1 }]">
          <span class="player-name">{{ player1 }}</span>
          <span class="player-score">{{ score1 }} pts</span>
        </div>
      </div>

      <!-- CANTO DIREITO: Jogador 2 -->
      <div :class="['player-box text-right', { disabled: activePlayer !== 2 }]">
        <span class="player-name">{{ player2 }}</span>
        <span class="player-score">{{ score2 }} pts</span>
      </div>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "PlayOffs",
  props: {
    player1: {
      type: String,
      default: "Jogador 1",
    },
    player2: {
      type: String,
      default: "Jogador 2",
    },
    score1: {
      type: Number,
      default: 0,
    },
    score2: {
      type: Number,
      default: 0,
    },
    activePlayer: {
      type: Number,
      default: 1,
    },
  },
};
</script>

<style scoped>
.playoffs-wrapper {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
}

.w-100 {
  width: 100%;
}

.player-box {
  display: flex;
  flex-direction: column;
  transition: opacity 0.3s ease, filter 0.3s ease;
}

.player-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
}

.player-score {
  font-size: 1.1rem;
  font-weight: 600;
  color: #57e71d;
}

.player-box.disabled {
  opacity: 0.35;
  filter: grayscale(100%);
}

.player-box.disabled .player-score {
  color: #cccccc;
}
</style>
