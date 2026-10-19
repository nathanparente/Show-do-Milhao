<template>
  <div
    class="player-timer"
    :class="{ 'is-active': isActive }"
    :style="activeStyle"
  >
    <v-icon :color="currentColor" class="mr-2">mdi-clock-outline</v-icon>
    <span class="timer-text" :style="{ color: currentColor }">{{
      formattedTime
    }}</span>
  </div>
</template>

<script>
import { PLAYOFFS_TIMER_SECONDS } from "@/constants/game";

export default {
  name: "PlayerTimer",
  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
    resetTrigger: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      timeLeft: this.getInitialSeconds(),
      timerInterval: null,
    };
  },
  computed: {
    formattedTime() {
      const hours = String(Math.floor(this.timeLeft / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((this.timeLeft % 3600) / 60)).padStart(
        2,
        "0"
      );
      const seconds = String(this.timeLeft % 60).padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    },
    currentColor() {
      if (!this.isActive) return "#B0BEC5";
      if (this.timeLeft >= 30) return "#4CAF50";
      if (this.timeLeft >= 15) return "#FFEB3B";
      return "#F44336";
    },
    activeStyle() {
      return this.isActive
        ? { opacity: 1, transform: "scale(1.05)" }
        : { opacity: 0.5, transform: "scale(1)" };
    },
  },
  watch: {
    isActive(newVal) {
      if (newVal) {
        this.startTimer();
      } else {
        this.stopTimer();
        this.timeLeft = this.getInitialSeconds();
      }
    },
    resetTrigger() {
      if (this.isActive) {
        this.startTimer();
      }
    },
  },
  mounted() {
    if (this.isActive) {
      this.startTimer();
    }
  },
  beforeDestroy() {
    this.stopTimer();
  },
  methods: {
    getInitialSeconds() {
      if (
        PLAYOFFS_TIMER_SECONDS &&
        typeof PLAYOFFS_TIMER_SECONDS.TIMER_SECONDS === "number"
      ) {
        return PLAYOFFS_TIMER_SECONDS.TIMER_SECONDS;
      }
      return 60;
    },
    startTimer() {
      this.stopTimer();
      this.timeLeft = this.getInitialSeconds();

      this.timerInterval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.stopTimer();
          this.$emit("time-up");
        }
      }, 1000);
    },
    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },
  },
};
</script>

<style scoped>
.player-timer {
  display: inline-flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 6px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
.timer-text {
  font-size: 1.25rem;
  font-weight: 900;
  letter-spacing: 1px;
  font-family: monospace;
}
</style>
