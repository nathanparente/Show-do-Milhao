<template>
  <v-col cols="auto" class="d-flex justify-center align-center">
    <v-badge
      :content="skipsRemaining"
      :value="skipsRemaining > 0"
      color="#012f6d"
      overlap
      offset-x="18"
      offset-y="18"
    >
      <v-btn
        id="btn-pulo"
        :disabled="disabled"
        large
        fab
        color="white"
        @click="$emit('skip')"
      >
        <v-icon color="#012f6d">mdi-rabbit</v-icon>
      </v-btn>
    </v-badge>
  </v-col>
</template>

<script>
export default {
  name: "SkipButton",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    skipsRemaining: {
      type: Number,
      default: 3,
    },
  },
};
</script>
