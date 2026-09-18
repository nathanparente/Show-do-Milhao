<template>
  <!-- START QUESTION CARD AREA -->
  <section v-if="currentQuestion" class="mt-20">
    <v-card
      class="mx-auto mt-10 mr-10 ml-10"
      max-width="100%"
      min-height="20vh"
      :elevation="2"
      outlined
    >
      <p class="question center-item">
        {{ displayIndex }}) {{ currentQuestion.question }}
      </p>
    </v-card>
  </section>
  <!-- END QUESTION CARD AREA -->
</template>

<script>
export default {
  name: "QuestionCard",
  props: {
    questions: {
      type: [Array, Object],
      default: () => [],
    },
  },
  computed: {
    currentIndex() {
      const routeId = Number(this.$route.params.questionId);
      if (isNaN(routeId) || routeId < 1) {
        return 0;
      }
      return routeId - 1;
    },
    currentQuestion() {
      if (Array.isArray(this.questions) && this.questions.length > 0) {
        return this.questions[this.currentIndex] || null;
      }
      return null;
    },
    displayIndex() {
      return this.currentIndex + 1;
    },
  },
};
</script>

<style scoped src="./style.css"></style>
