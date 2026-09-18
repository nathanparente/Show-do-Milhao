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
    // Busca a pergunta atual no array de perguntas gerado pela IA
    currentQuestion() {
      if (Array.isArray(this.questions) && this.questions.length > 0) {
        return this.questions[this.currentIndex] || null;
      }
      return null;
    },
    // Número amigável exibido na pergunta /question/{number}
    displayIndex() {
      return this.currentIndex + 1;
    },
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
