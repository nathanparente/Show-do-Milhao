<template>
  <v-col cols="auto" class="help-buttons-wrapper">
    <v-row justify="space-between" align="center" no-gutters>
      <!-- Botões de Ajudas Comuns (Cartas, IA, Universitários) -->
      <template v-for="(btn, index) in buttons">
        <v-col
          v-if="isButtonVisible(btn)"
          :key="btn.id"
          cols="auto"
          class="d-flex justify-center align-center"
        >
          <v-btn
            :id="btn.id"
            :disabled="isButtonDisabled(btn)"
            large
            fab
            color="white"
            @click="$emit('help-click', { id: btn.id, index })"
          >
            <v-icon color="#012f6d">{{ btn.icon }}</v-icon>
          </v-btn>
        </v-col>
      </template>

      <!-- Botão Pulo: exibido conforme a configuração do GameConfig -->
      <SkipButton
        v-if="shouldShowSkip"
        :disabled="isSkipDisabled"
        :skips-remaining="skipsRemaining"
        @skip="$emit('skip-click')"
      />

      <!-- Botão Truco: exibido conforme a configuração do GameConfig e o modo de jogo -->
      <v-col
        v-if="shouldShowTruco"
        cols="auto"
        class="d-flex justify-center align-center"
      >
        <v-btn
          id="btn-truco"
          :disabled="isTrucoDisabled"
          large
          fab
          color="white"
          @click="$emit('truco-click')"
        >
          <v-icon color="#012f6d">mdi-poker-chip</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import SkipButton from "./SkipButton.vue";
import { getConfig } from "@/utils/configManager";

export default {
  name: "HelpButtons",
  components: {
    SkipButton,
  },
  props: {
    buttons: {
      type: Array,
      required: true,
    },
    isLastQuestion: {
      type: Boolean,
      default: false,
    },
    isPlayoffsMode: {
      type: Boolean,
      default: false,
    },
    showTruco: {
      type: Boolean,
      default: false,
    },
    isTrucoDisabled: {
      type: Boolean,
      default: false,
    },
    showSkip: {
      type: Boolean,
      default: null, // Se não for passado via prop, assume a configuração de activeHelps
    },
    isSkipDisabled: {
      type: Boolean,
      default: false,
    },
    skipsRemaining: {
      type: Number,
      default: 3,
    },
  },
  computed: {
    activeHelps() {
      const config = getConfig();
      const mode = this.isPlayoffsMode ? "playoffs" : "million_game";
      return (config && config.ACTIVE_HELPS && config.ACTIVE_HELPS[mode]) || {};
    },
    shouldShowSkip() {
      if (this.showSkip !== null && this.showSkip !== undefined) {
        return this.showSkip;
      }
      return Boolean(this.activeHelps.pulo);
    },
    shouldShowTruco() {
      if (this.activeHelps.truco !== undefined) {
        return this.showTruco && Boolean(this.activeHelps.truco);
      }
      return this.showTruco;
    },
  },
  methods: {
    isButtonVisible(btn) {
      const keyMap = {
        "btn-cartas": "cartas",
        "btn-ia": "ia",
        "btn-universitarios": "universitarios",
      };

      const key = keyMap[btn.id];
      if (key && this.activeHelps[key] !== undefined) {
        return Boolean(this.activeHelps[key]);
      }
      return true;
    },
    isButtonDisabled(btn) {
      // Regra de segurança: na última pergunta a IA não pode ser utilizada
      if (btn.id === "btn-ia" && this.isLastQuestion) {
        return true;
      }
      return btn.isDisabled;
    },
  },
};
</script>
