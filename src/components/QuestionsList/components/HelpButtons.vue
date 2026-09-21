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
    </v-row>
  </v-col>
</template>

<script>
export default {
  name: "HelpButtons",
  props: {
    buttons: {
      type: Array,
      required: true,
    },
    isLastQuestion: {
      type: Boolean,
      default: false,
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
