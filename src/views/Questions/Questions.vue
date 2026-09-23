<template>
  <v-app>
    <div class="home app-bg-color fill-height">
      <section v-if="!isLoading" class="pa-6">
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

        <v-row
          v-else
          align="center"
          :justify="gameMode === 'million_game' ? 'space-between' : 'start'"
          class="ma-0"
        >
          <v-btn large fab color="white" @click="replaceState">
            <v-icon color="#012f6d">mdi-home</v-icon>
          </v-btn>

          <div
            v-if="gameMode === 'million_game'"
            class="text-right white--text"
          >
            <div class="accumulated-label">TOTAL ACUMULADO</div>
            <div class="accumulated-value">{{ formattedMillionScore }}</div>
          </div>
        </v-row>
      </section>

      <section>
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
            <p class="progress-phase" aria-live="polite">{{ phaseText }}</p>
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

        <v-row
          v-else-if="questions && questions.length > 0"
          justify="center"
          align="start"
        >
          <v-col cols="12" md="10" lg="8" class="px-4">
            <QuestionCard :questions="questions" />
            <QuestionsList
              :questions="questions"
              @playoffs-state-updated="onPlayoffsStateUpdated"
              @million-state-updated="onMillionStateUpdated"
            />
          </v-col>
        </v-row>

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
import { GAME_CONFIG } from "@/config/gameConfig";
import { UI_TEXTS, MILLION_GAME_CONFIG, PROGRESS_CONFIG } from "@/constants";
import { generateFn } from "@/services/ollamaService";

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
      millionScore: 0,
      targetProgress: 0,
      receivedFirstToken: false,
      phase: "waiting",
      phaseCurrent: 0,
      phaseTotal: 0,
    };
  },
  computed: {
    formattedMillionScore() {
      return this.millionScore.toLocaleString("pt-BR");
    },
    phaseText() {
      const map = {
        waiting: this.uiTexts.PHASE_WAITING,
        generating: this.uiTexts.PHASE_GENERATING,
        validating: this.uiTexts.PHASE_VALIDATING,
        regenerating: this.uiTexts.PHASE_REGENERATING,
        done: this.uiTexts.PHASE_DONE,
      };
      return (map[this.phase] || "")
        .replace("{current}", this.phaseCurrent)
        .replace("{total}", this.phaseTotal);
    },
  },
  watch: {
    "$route.params.questionId": {
      immediate: true,
      handler() {
        this.loadPlayoffsData();
        this.loadMillionData();
      },
    },
  },
  async created() {
    await this.gerarPerguntasComIA();
  },
  beforeDestroy() {
    this.stopProgressLoop();
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
    loadMillionData() {
      const stored = localStorage.getItem(MILLION_GAME_CONFIG.STORAGE_KEY);
      this.millionScore = parseInt(stored, 10) || 0;
    },
    onPlayoffsStateUpdated(newState) {
      this.player1 = newState.player1;
      this.player2 = newState.player2;
      this.score1 = newState.score1;
      this.score2 = newState.score2;
      this.activePlayer = newState.activePlayer;
    },
    onMillionStateUpdated(newScore) {
      this.millionScore = newScore;
    },

    startProgressLoop() {
      this.stopProgressLoop();
      this.progress = 0;
      this.targetProgress = 0;
      this.receivedFirstToken = false;
      this.phase = "waiting";
      this.phaseCurrent = 0;
      this.phaseTotal = 0;

      const startTime = performance.now();

      const tick = () => {
        if (!this.receivedFirstToken) {
          const elapsed = performance.now() - startTime;
          this.targetProgress =
            PROGRESS_CONFIG.WAITING_MAX * (1 - Math.exp(-elapsed / 5000));
        }

        const diff = this.targetProgress - this.progress;
        if (diff > 0) {
          this.progress = Math.min(
            this.progress + Math.max(diff * 0.1, 0.05),
            this.targetProgress
          );
        }

        this.animationFrameId = requestAnimationFrame(tick);
      };

      this.animationFrameId = requestAnimationFrame(tick);
    },

    onQuizProgress({ percent, phase, current, total }) {
      this.receivedFirstToken = true;
      this.targetProgress = Math.max(this.targetProgress, percent);

      this.phase = phase;
      if (current) this.phaseCurrent = current;
      if (total) this.phaseTotal = total;
    },

    finishProgress() {
      this.receivedFirstToken = true;
      this.targetProgress = 100;
      this.phase = "done";

      return new Promise((resolve) => {
        const check = () => {
          if (this.progress >= 99.5) {
            this.progress = 100;
            setTimeout(resolve, 250);
          } else {
            requestAnimationFrame(check);
          }
        };
        check();
      });
    },

    stopProgressLoop() {
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

      this.startProgressLoop();

      try {
        const iaJson = await GAME_CONFIG.GENERATE_VALIDATED_QUIZ(
          generateFn,
          activeThemes,
          totalQuestions,
          { onProgress: this.onQuizProgress }
        );

        this.questions = iaJson.perguntas.map((itemIA, index) =>
          this.formatarParaModeloDoJogo(itemIA, index)
        );

        await this.finishProgress();
      } catch (error) {
        console.error("Erro ao gerar perguntas com IA:", error);
      } finally {
        this.stopProgressLoop();
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
      choices = GAME_CONFIG._shuffleArray(choices);
      return {
        id: idIndex,
        question: itemIA.pergunta,
        difficulty: 0,
        choices: choices,
      };
    },
    clearGameData() {
      localStorage.removeItem("gameMode");
      localStorage.removeItem("player1");
      localStorage.removeItem("player2");
      localStorage.removeItem("score1");
      localStorage.removeItem("score2");
      localStorage.removeItem("activePlayer");
      localStorage.removeItem("p1Errored");
      localStorage.removeItem("p2Errored");
      localStorage.removeItem(MILLION_GAME_CONFIG.STORAGE_KEY);
    },
    replaceState() {
      this.clearGameData();
      this.$store.replaceState({
        callHelp: "",
      });
      this.$router.push("/");
    },
  },
};
</script>

<style scoped src="./style.css"></style>
