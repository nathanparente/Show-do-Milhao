<template>
  <v-col cols="auto" class="help-buttons-wrapper">
    <v-row justify="space-between" align="center" no-gutters>
      <v-col
        v-for="(btn, index) in buttons"
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

      <!-- Botão Pulo: disponível em ambos os modos -->
      <SkipButton
        :disabled="isSkipDisabled"
        :skips-remaining="skipsRemaining"
        @skip="$emit('skip-click')"
      />

      <!-- Botão Truco: exclusivo do modo PlayOffs -->
      <v-col
        v-if="showTruco"
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

export default {
  name: "HelpButtons",
  components: { SkipButton },
  props: {
    buttons: {
      type: Array,
      required: true,
    },
    isLastQuestion: {
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
    isSkipDisabled: {
      type: Boolean,
      default: false,
    },
    skipsRemaining: {
      type: Number,
      default: 3,
    },
  },
  methods: {
    isButtonDisabled(btn) {
      if (btn.id === "btn-gepeto" && this.isLastQuestion) {
        return true;
      }
      return btn.isDisabled;
    },
  },
};
</script>
