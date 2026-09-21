<template>
  <v-dialog :value="dialog" persistent max-width="400">
    <v-card class="text-center pa-6">
      <h1 class="truco-title">TRUCO !!!</h1>

      <v-card-actions class="justify-center flex-column mt-4">
        <v-btn
          color="#57e71d"
          dark
          large
          block
          class="mb-3"
          @click="$emit('accept')"
        >
          Aceitar
        </v-btn>
        <v-btn
          color="red darken-1"
          dark
          large
          block
          @click="$emit('double-down')"
        >
          Dobrar a Aposta
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "TrucoDialog",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.truco-title {
  font-size: 32px;
  font-weight: 900;
  color: #012f6d;
  letter-spacing: 2px;
}
</style>
