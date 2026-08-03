<template>
  <!-- START QUESTION CARD AREA -->
  <section class="mt-100">
    <v-card
      class="mx-auto mt-10 mr-10 ml-10"
      max-width="100%"
      min-height="20vh"
      :elevation="2"
      outlined
    >
      <p class="question center-item">
        {{ questions[$route.params.questionId - 1].id + 1 }})
        {{ questions[$route.params.questionId - 1].question }}
      </p>
    </v-card>
  </section>
  <!-- END QUESTION CARD AREA -->
</template>

<script>
export default {
  props: {
    questions: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.title {
  font-size: 32px;
  color: black;
  font-weight: 700;
}
.question {
  font-size: 24px;
  color: black;
}
</style>
