<template>
  <!-- START QUESTION CARD AREA -->
  <section v-if="currentQuestion" class="mt-100">
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
    // Converte a rota (1 a 5) no índice do Array JavaScript (0 a 4)
    currentIndex() {
      const routeId = Number(this.$route.params.questionId);
      if (isNaN(routeId) || routeId < 1) {
        return 0; // Se a rota for 0 ou inválida, força o primeiro índice (0)
      }
      return routeId - 1; // Ex: Rota /questions/1 vira índice 0
    },
    // Busca a pergunta atual no array de 5 perguntas gerado pela IA
    currentQuestion() {
      if (Array.isArray(this.questions) && this.questions.length > 0) {
        return this.questions[this.currentIndex] || null;
      }
      return null;
    },
    // Número amigável exibido na pergunta (1 a 5)
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
