<template>
  <v-app>
    <div class="home app-bg-color fill-height">
      <!-- Botão Voltar/Home -->
      <section>
        <v-row class="mt-10 ml-10" justify="start" align="start">
          <v-btn class="" large fab color="white" @click="replaceState">
            <v-icon>mdi-home</v-icon>
          </v-btn>
        </v-row>
      </section>

      <!-- Conteúdo do Jogo -->
      <section>
        <!-- ESTADO 1: Carregando IA (Impede o QuestionCard de rodar sem dados) -->
        <v-row v-if="isLoading" justify="center" align="center" class="mt-12">
          <v-col cols="12" class="text-center white--text">
            <v-progress-circular
              indeterminate
              color="white"
              size="64"
              class="mb-4"
            ></v-progress-circular>
            <h2 class="text-h5 font-weight-bold">
              🧠 A IA está gerando sua pergunta...
            </h2>
            <p class="subtitle-1">Aguarde alguns segundos</p>
          </v-col>
        </v-row>

        <!-- ESTADO 2: Exibe o jogo somente quando houver perguntas montadas -->
        <v-row
          v-else-if="questions && questions.length > 0"
          justify="center"
          align="start"
        >
          <v-col cols="12" xs="12" md="6" justify="center" align="center">
            <QuestionCard :questions="questions" />
            <QuestionsList :questions="questions" />
          </v-col>
          <v-col cols="12" xs="12" md="4" justify="center" align="center">
            <HelpCard />
          </v-col>
        </v-row>

        <!-- ESTADO 3: Trativa caso o Ollama falhe -->
        <v-row v-else justify="center" align="center" class="mt-12">
          <v-col cols="12" class="text-center white--text">
            <p class="text-h6">Não foi possível conectar ao Ollama local.</p>
            <v-btn color="error" @click="gerarPerguntasComIA"
              >Tentar Novamente</v-btn
            >
          </v-col>
        </v-row>
      </section>
    </div>
  </v-app>
</template>

<script>
export default {
  components: {
    QuestionCard: () => import("@/components/QuestionCard/QuestionCard"),
    QuestionsList: () => import("@/components/QuestionsList/QuestionsList"),
    HelpCard: () => import("@/components/HelpCard/HelpCard"),
  },
  data() {
    return {
      questions: [],
      isLoading: true,
    };
  },
  async created() {
    await this.gerarPerguntasComIA();
  },
  methods: {
    async gerarPerguntasComIA() {
      this.isLoading = true;
      const temas = ["Desenvolvimento Web", "UI/UX", "CRO"];
      const quantidadePerguntas = 5;

      try {
        const response = await fetch("http://localhost:11434/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "llama3",
            format: "json",
            stream: false,
            options: { temperature: 0.7 },
            prompt: `Crie ${quantidadePerguntas} perguntas de múltipla escolha sobre ${temas.join(
              ", "
            )}.
            Retorne APENAS um objeto JSON estrito no seguinte formato:
            {
              "perguntas": [
                {
                  "pergunta": "Texto da pergunta",
                  "correta": "A alternativa correta",
                  "incorretas": ["Incorreta 1", "Incorreta 2", "Incorreta 3"]
                }
              ]
            }`,
          }),
        });

        const data = await response.json();
        const iaJson = JSON.parse(data.response);

        this.questions = iaJson.perguntas.map((itemIA, index) => {
          return this.formatarParaModeloDoJogo(itemIA, index);
        });
      } catch (error) {
        console.error("Erro ao gerar perguntas com IA:", error);
      } finally {
        this.isLoading = false;
      }
    },

    formatarParaModeloDoJogo(itemIA, idIndex) {
      let choices = [
        {
          answer: itemIA.correta,
          isTrue: true,
          isOnHalf: true,
          isOnCallHelp: true,
          probability: 65,
        },
        {
          answer: itemIA.incorretas[0],
          isTrue: false,
          isOnHalf: true,
          isOnCallHelp: false,
          probability: 20,
        },
        {
          answer: itemIA.incorretas[1],
          isTrue: false,
          isOnHalf: false,
          isOnCallHelp: false,
          probability: 10,
        },
        {
          answer: itemIA.incorretas[2],
          isTrue: false,
          isOnHalf: false,
          isOnCallHelp: false,
          probability: 5,
        },
      ];

      choices = choices.sort(() => Math.random() - 0.5);

      return {
        id: idIndex,
        question: itemIA.pergunta,
        difficulty: 0,
        choices: choices,
      };
    },

    replaceState: function () {
      this.$store.replaceState({
        chartData: [
          ["Alternativas", "Porcentagem de votos da platéia"],
          ["A", 0],
          ["B", 0],
          ["C", 0],
          ["D", 0],
        ],
        callHelp: "",
      });
      this.$router.push(`/`);
    },
  },
};
</script>
