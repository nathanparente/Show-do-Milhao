<template>
  <v-dialog :value="dialog" persistent max-width="400">
    <v-card class="text-center pa-4">
      <v-card-title class="justify-center"> Desistiu </v-card-title>
      <v-card-actions class="justify-center">
        <v-btn color="primary" @click="$emit('continue')"> OK </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "GiveUpDialog",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
