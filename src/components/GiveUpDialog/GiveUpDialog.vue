<template>
  <v-dialog :value="dialog" persistent max-width="400">
    <v-card class="text-center pa-4">
      <v-img :src="giveUpGif" contain max-height="250" class="mx-auto" />

      <v-card-actions class="justify-center mt-4">
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
  data() {
    return {
      giveUpGif: require("@/assets/images/bg/arregou-silvio.gif"),
    };
  },
};
</script>
