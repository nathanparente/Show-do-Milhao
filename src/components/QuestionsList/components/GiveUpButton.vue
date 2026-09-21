<template>
  <v-col cols="auto" class="giveup-button-wrapper">
    <v-btn
      v-if="show"
      id="btn-desistir"
      large
      color="red darken-1"
      dark
      @click="$emit('give-up')"
    >
      Desistir
    </v-btn>
  </v-col>
</template>

<script>
export default {
  name: "GiveUpButton",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
