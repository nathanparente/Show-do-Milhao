<template>
  <v-dialog
    :value="dialog"
    persistent
    max-width="400"
    content-class="timeout-dialog"
  >
    <v-card class="text-center pb-4 pt-6 px-4 dialog-card">
      <v-card-text>
        <v-icon color="#F44336" size="64" class="mb-4"
          >mdi-timer-off-outline</v-icon
        >
        <h2 class="text-h5 font-weight-bold mb-2 white--text">
          Que pena, seu tempo acabou
        </h2>
        <p class="subtitle-1 grey--text text--lighten-1">
          Você demorou muito para responder e perdeu a vez.
        </p>
      </v-card-text>
      <v-card-actions class="justify-center mt-2">
        <v-btn
          color="#012f6d"
          class="white--text font-weight-bold px-6"
          rounded
          large
          @click="$emit('continue')"
        >
          Passar a vez
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "TimeOutDialog",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.timeout-dialog .dialog-card {
  background-color: #1e1e1e !important;
  border: 2px solid #333 !important;
  border-radius: 16px !important;
}
</style>
