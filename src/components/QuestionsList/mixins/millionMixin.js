import { MILLION_GAME_CONFIG } from "@/constants/gameConfig";

export default {
  data() {
    return {
      millionScore: 0,
    };
  },
  computed: {
    isMillionMode() {
      return (localStorage.getItem("gameMode") || "") === "million_game";
    },
  },
  methods: {
    initMillionState() {
      if (!this.isMillionMode) return;
      const stored = localStorage.getItem(MILLION_GAME_CONFIG.STORAGE_KEY);
      this.millionScore = parseInt(stored, 10) || 0;
    },
    addMillionPoints() {
      if (!this.isMillionMode) return;
      this.millionScore += MILLION_GAME_CONFIG.QUESTION_VALUE;
      localStorage.setItem(MILLION_GAME_CONFIG.STORAGE_KEY, this.millionScore);
      this.emitMillionStateUpdate();
    },
    halveMillionScore() {
      if (!this.isMillionMode) return;
      this.millionScore = Math.floor(this.millionScore / 2);
      localStorage.setItem(MILLION_GAME_CONFIG.STORAGE_KEY, this.millionScore);
      this.emitMillionStateUpdate();
    },
    emitMillionStateUpdate() {
      this.$emit("million-state-updated", this.millionScore);
    },
    clearMillionData() {
      localStorage.removeItem(MILLION_GAME_CONFIG.STORAGE_KEY);
    },
  },
};
