<template>
  <div class="playoffs-wrapper">
    <v-row align="center" justify="space-between" class="ma-0 w-100">
      <!-- CANTO ESQUERDO: Botão Home (slot) + Jogador 1 -->
      <div class="d-flex align-center">
        <slot name="left-action" />
        <div :class="['player-box', { disabled: activePlayer !== 1 }]">
          <div class="d-flex align-center">
            <span class="player-name mr-2">{{ player1 }}</span>
            <PlayerTimer
              :is-active="activePlayer === 1"
              :reset-trigger="timerResetKey"
              class="mini-timer"
              @time-up="$emit('time-up')"
            />
          </div>
          <span class="player-score">{{ score1 }} pts</span>
        </div>
      </div>

      <!-- CANTO DIREITO: Jogador 2 -->
      <div
        :class="[
          'player-box text-right align-end',
          { disabled: activePlayer !== 2 },
        ]"
      >
        <div class="d-flex align-center justify-end">
          <PlayerTimer
            :is-active="activePlayer === 2"
            :reset-trigger="timerResetKey"
            class="mini-timer mr-2"
            @time-up="$emit('time-up')"
          />
          <span class="player-name">{{ player2 }}</span>
        </div>
        <span class="player-score">{{ score2 }} pts</span>
      </div>
    </v-row>
  </div>
</template>

<script>
import PlayerTimer from "@/components/PlayerTimer/PlayerTimer.vue";

export default {
  name: "PlayOffs",
  components: {
    PlayerTimer,
  },
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
    timerResetKey: {
      type: Number,
      default: 0,
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

/* Modificadores para ajustar o timer dentro do PlayOffs */
:deep(.mini-timer) {
  padding: 2px 8px !important;
}
:deep(.mini-timer .v-icon) {
  font-size: 16px !important;
  margin-right: 4px !important;
}
:deep(.mini-timer .timer-text) {
  font-size: 0.9rem !important; /* Fonte menor */
}
</style>
