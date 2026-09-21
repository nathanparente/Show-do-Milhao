<template>
  <v-dialog :value="dialog" persistent max-width="450">
    <v-card class="text-center pa-6 rounded-xl">
      <v-icon color="#f60808" size="64" class="mb-2">
        mdi-alert-circle-outline
      </v-icon>

      <v-card-title
        class="text-h5 font-weight-bold justify-center red--text text--darken-2 pa-0 mb-2"
      >
        {{ playerName }}, ERRROOOUUU!
      </v-card-title>

      <v-card-text class="body-1 black--text mt-2 pa-0">
        <p class="mb-4 black-text">{{ subtitle }}</p>

        <div
          class="py-3 px-6 grey lighten-3 rounded-lg d-inline-block border-highlight"
        >
          <span
            class="caption text-uppercase grey--text text--darken-2 font-weight-bold d-block"
          >
            Sua nova pontuação
          </span>
          <span class="text-h5 font-weight-black blue--text text--darken-4">
            {{ newScore }} pts
          </span>
        </div>
      </v-card-text>

      <v-card-actions class="justify-center mt-6 pa-0">
        <v-btn
          color="#012f6d"
          dark
          large
          rounded
          block
          class="font-weight-bold text-none text-subtitle-1"
          @click="$emit('continue')"
        >
          {{ buttonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { UI_TEXTS } from "@/constants/gameConfig";

export default {
  name: "TurnLostDialog",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    playerName: {
      type: String,
      default: "",
    },
    newScore: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      subtitle: UI_TEXTS.PLAYOFFS_TURN_LOST_SUBTITLE,
      buttonText: UI_TEXTS.PLAYOFFS_CONTINUE_BUTTON,
    };
  },
};
</script>

<style scoped>
.black-text {
  color: #000000 !important;
}
.border-highlight {
  border: 2px solid #e0e0e0;
}
</style>
