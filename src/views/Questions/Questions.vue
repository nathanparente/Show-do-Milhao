<template>
  <v-app>
    <div class="home app-bg-color fill-height">
      <!-- HEADER DO JOGO -->
      <section class="pa-6">
        <!-- SE FOR PLAYOFFS: Exibe o subcomponente com o botão Home no slot -->
        <PlayOffs
          v-if="gameMode === 'playoffs'"
          :player1="player1"
          :player2="player2"
          :score1="score1"
          :score2="score2"
          :active-player="activePlayer"
        >
          <template #left-action>
            <v-btn large fab color="white" class="mr-6" @click="replaceState">
              <v-icon color="#012f6d">mdi-home</v-icon>
            </v-btn>
          </template>
        </PlayOffs>

        <!-- MODO PADRÃO: Exibe apenas o botão Home -->
        <v-row v-else align="center" justify="start" class="ma-0">
          <v-btn large fab color="white" @click="replaceState">
            <v-icon color="#012f6d">mdi-home</v-icon>
          </v-btn>
        </v-row>
      </section>

      <!-- Conteúdo do Jogo -->
      <section>
        <!-- ESTADO 1: Loading da IA -->
        <v-row
          v-if="isLoading"
          justify="center"
          align="center"
          style="min-height: 70vh"
        >
          <v-col cols="12" class="text-center white--text">
            <v-img
              src="@/assets/images/bg/loading-llama.gif"
              max-width="200"
              max-height="200"
              contain
              class="mx-auto mb-4"
            ></v-img>
            <h2 class="text-h5 font-weight-bold">
              {{ uiTexts.LOADING_TITLE }}
            </h2>

            <div class="progress-container mx-auto">
              <div class="progress-fill" :style="{ width: progress + '%' }">
                <span v-if="progress > 10" class="progress-text">
                  {{ Math.floor(progress) }}%
                </span>
              </div>
            </div>
            <p class="subtitle-1 mb-6">{{ uiTexts.LOADING_SUBTITLE }}</p>
          </v-col>
        </v-row>

        <!-- ESTADO 2: Jogo Ativo -->
        <v-row
          v-else-if="questions && questions.length > 0"
          justify="center"
          align="start"
        >
          <v-col cols="12" md="10" lg="8" class="px-4">
            <QuestionCard :questions="questions" />
            <QuestionsList :questions="questions" />
          </v-col>
        </v-row>

        <!-- ESTADO 3: Erro de Conexão -->
        <v-row v-else justify="center" align="center" class="mt-12">
          <v-col cols="12" class="text-center white--text">
            <p class="text-h6">{{ uiTexts.ERROR_TITLE }}</p>
            <p class="caption mb-4">{{ uiTexts.ERROR_SUBTITLE }}</p>
            <v-btn color="error" @click="gerarPerguntasComIA">
              {{ uiTexts.ERROR_BUTTON }}
            </v-btn>
          </v-col>
        </v-row>
      </section>
    </div>
  </v-app>
</template>

<script>
import { GAME_CONFIG, UI_TEXTS } from "@/constants/gameConfig";

export default {
  name: "Questions",
  components: {
    QuestionCard: () => import("@/components/QuestionCard/QuestionCard"),
    QuestionsList: () => import("@/components/QuestionsList/QuestionsList"),
    PlayOffs: () => import("@/components/PlayOffs/PlayOffs"),
  },
  data() {
    return {
      questions: [],
      isLoading: true,
      progress: 0,
      animationFrameId: null,
      uiTexts: UI_TEXTS,

      gameMode: "",
      player1: "Jogador 1",
      player2: "Jogador 2",
      score1: 0,
      score2: 0,
      activePlayer: 1,
    };
  },
  watch: {
    "$route.params.questionId": {
      immediate: true,
      handler() {
        this.loadPlayoffsData();
      },
    },
  },
  async created() {
    await this.gerarPerguntasComIA();
  },
  beforeDestroy() {
    this.stopTimeProgress();
  },
  methods: {
    loadPlayoffsData() {
      this.gameMode = localStorage.getItem("gameMode") || "";
      this.player1 = localStorage.getItem("player1") || "Jogador 1";
      this.player2 = localStorage.getItem("player2") || "Jogador 2";
      this.score1 = parseInt(localStorage.getItem("score1")) || 0;
      this.score2 = parseInt(localStorage.getItem("score2")) || 0;
      this.activePlayer = parseInt(localStorage.getItem("activePlayer")) || 1;
    },
    startTimeProgress(totalQuestions) {
      this.stopTimeProgress();
      this.progress = 0;
      const startTime = performance.now();
      const estimatedTotalMs = totalQuestions * 2500;

      const updateProgress = () => {
        const elapsedMs = performance.now() - startTime;
        if (elapsedMs <= estimatedTotalMs) {
          this.progress = (elapsedMs / estimatedTotalMs) * 90;
        } else {
          const extraTimeMs = elapsedMs - estimatedTotalMs;
          this.progress = 90 + (1 - Math.exp(-extraTimeMs / 6000)) * 8;
        }

        if (this.isLoading && this.progress < 99) {
          this.animationFrameId = requestAnimationFrame(updateProgress);
        }
      };

      this.animationFrameId = requestAnimationFrame(updateProgress);
    },
    stopTimeProgress() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
    },
    async gerarPerguntasComIA() {
      this.isLoading = true;
      const activeThemes = this.$route.query.themes
        ? this.$route.query.themes.split(",")
        : GAME_CONFIG.THEMES;
      const totalQuestions = GAME_CONFIG.TOTAL_QUESTIONS;

      this.startTimeProgress(totalQuestions);

      try {
        const response = await fetch(GAME_CONFIG.OLLAMA_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: GAME_CONFIG.MODEL_NAME,
            format: "json",
            stream: false,
            options: {
              temperature: GAME_CONFIG.TEMPERATURE,
              num_ctx: 4096,
            },
            prompt: GAME_CONFIG.GET_PROMPT(activeThemes, totalQuestions),
          }),
        });

        const data = await response.json();
        const iaJson = JSON.parse(data.response);

        this.questions = iaJson.perguntas.map((itemIA, index) => {
          return this.formatarParaModeloDoJogo(itemIA, index);
        });

        this.stopTimeProgress();
        this.progress = 100;
        await new Promise((resolve) => setTimeout(resolve, 400));
      } catch (error) {
        console.error("Erro ao gerar perguntas com IA:", error);
        this.stopTimeProgress();
      } finally {
        this.isLoading = false;
      }
    },
    limparTexto(texto) {
      if (typeof texto !== "string") return "";
      return texto.replace(/^[A-Da-d1-4][\)\.\:\-]\s*/, "").trim();
    },
    formatarParaModeloDoJogo(itemIA, idIndex) {
      let choices = [
        {
          answer: this.limparTexto(itemIA.correta),
          isTrue: true,
          isOnHalf: true,
          isOnCallHelp: true,
          probability: 65,
        },
        {
          answer: this.limparTexto(itemIA.incorretas[0]),
          isTrue: false,
          isOnHalf: true,
          isOnCallHelp: false,
          probability: 20,
        },
        {
          answer: this.limparTexto(itemIA.incorretas[1]),
          isTrue: false,
          isOnHalf: false,
          isOnCallHelp: false,
          probability: 10,
        },
        {
          answer: this.limparTexto(itemIA.incorretas[2]),
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
    replaceState() {
      this.$store.replaceState({
        callHelp: "",
      });
      this.$router.push("/");
    },
  },
};
</script>

<style scoped src="./style.css"></style>
