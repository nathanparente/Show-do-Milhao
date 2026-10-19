<template>
  <div :class="['carousel-wrapper', { compact }]">
    <div ref="swiper" class="swiper instructions-swiper">
      <div class="swiper-wrapper">
        <div v-for="slide in slides" :key="slide.id" class="swiper-slide">
          <v-card class="instruction-card" elevation="3">
            <div class="icon-row">
              <v-icon
                v-for="icon in slide.icons"
                :key="icon"
                :size="iconSize(slide)"
                color="#012f6d"
              >
                {{ icon }}
              </v-icon>
            </div>
            <h2 class="instruction-title">{{ slide.title }}</h2>
            <p
              v-for="(paragraph, i) in slide.paragraphs"
              :key="i"
              class="instruction-text"
            >
              {{ paragraph }}
            </p>
          </v-card>
        </div>
      </div>
    </div>

    <!-- INDICADORES -->
    <div class="dots">
      <span
        v-for="(slide, i) in slides"
        :key="slide.id"
        :class="['dot', { active: i === activeIndex }]"
        @click="goTo(i)"
      ></span>
    </div>

    <!-- CONTROLES: SETA ESQUERDA | PAUSE/PLAY | SETA DIREITA -->
    <div v-if="showControls" class="controls">
      <v-btn
        large
        fab
        color="white"
        :aria-label="uiTexts.INSTRUCTIONS_ARIA_PREV"
        @click="prev"
      >
        <v-icon color="#012f6d">mdi-chevron-left</v-icon>
      </v-btn>

      <v-btn
        large
        fab
        color="white"
        :aria-label="
          isPlaying
            ? uiTexts.INSTRUCTIONS_ARIA_PAUSE
            : uiTexts.INSTRUCTIONS_ARIA_PLAY
        "
        @click="toggleAutoplay"
      >
        <v-icon color="#012f6d">
          {{ isPlaying ? "mdi-pause" : "mdi-play" }}
        </v-icon>
      </v-btn>

      <v-btn
        large
        fab
        color="white"
        :aria-label="uiTexts.INSTRUCTIONS_ARIA_NEXT"
        @click="next"
      >
        <v-icon color="#012f6d">mdi-chevron-right</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import Swiper, { Autoplay, Keyboard, A11y } from "swiper";
import "swiper/swiper.min.css";
import { UI_TEXTS, INSTRUCTIONS_CONFIG, PLAYOFFS_SCORING } from "@/constants";

// Valores disponíveis como {placeholder} nos textos
const SCORING_PLACEHOLDERS = Object.freeze({
  normal_win: PLAYOFFS_SCORING.NORMAL_WIN_POINTS,
  truco_simple_win: PLAYOFFS_SCORING.TRUCO_SIMPLE_WIN_POINTS,
  truco_double_win: PLAYOFFS_SCORING.TRUCO_DOUBLE_WIN_POINTS,
  truco_simple_penalty: PLAYOFFS_SCORING.TRUCO_SIMPLE_ERROR_PENALTY,
  truco_doubled_penalty: PLAYOFFS_SCORING.TRUCO_DOUBLED_ERROR_PENALTY,
});

export default {
  name: "InstructionsCarousel",
  props: {
    // Exibe as setas e o botão de pause/play
    showControls: {
      type: Boolean,
      default: true,
    },
    // Versão reduzida do card (usada na tela de loading)
    compact: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      uiTexts: UI_TEXTS,
      activeIndex: 0,
      isPlaying: true,
    };
  },
  computed: {
    slides() {
      const t = this.uiTexts;
      const fmt = (text) =>
        text.replace(/\{(\w+)\}/g, (match, key) =>
          key in SCORING_PLACEHOLDERS ? SCORING_PLACEHOLDERS[key] : match
        );

      return [
        {
          id: 1,
          icons: ["mdi-gamepad-variant"],
          title: t.INSTRUCTIONS_MODES_TITLE,
          paragraphs: [t.INSTRUCTIONS_MODES_TEXT],
        },
        {
          id: 2,
          icons: ["mdi-sword-cross"],
          title: t.INSTRUCTIONS_PLAYOFFS_TITLE,
          paragraphs: [t.INSTRUCTIONS_PLAYOFFS_TEXT],
        },
        {
          id: 3,
          icons: ["mdi-cash-multiple"],
          title: t.INSTRUCTIONS_MILLION_TITLE,
          paragraphs: [t.INSTRUCTIONS_MILLION_TEXT],
        },
        {
          id: 4,
          icons: [
            "mdi-cards-playing-spade-multiple",
            "mdi-robot",
            "mdi-account-group",
            "mdi-rabbit",
          ],
          title: t.INSTRUCTIONS_HELPS_TITLE,
          paragraphs: [
            t.INSTRUCTIONS_HELPS_TEXT_1,
            t.INSTRUCTIONS_HELPS_TEXT_2,
          ],
        },
        {
          id: 5,
          icons: ["mdi-cards-playing-spade-multiple"],
          title: t.INSTRUCTIONS_CARTAS_TITLE,
          paragraphs: [t.INSTRUCTIONS_CARTAS_TEXT],
        },
        {
          id: 6,
          icons: ["mdi-robot"],
          title: t.INSTRUCTIONS_IA_TITLE,
          paragraphs: [t.INSTRUCTIONS_IA_TEXT],
        },
        {
          id: 7,
          icons: ["mdi-account-group"],
          title: t.INSTRUCTIONS_UNIVERSITARIOS_TITLE,
          paragraphs: [t.INSTRUCTIONS_UNIVERSITARIOS_TEXT],
        },
        {
          id: 8,
          icons: ["mdi-rabbit"],
          title: t.INSTRUCTIONS_SKIP_TITLE,
          paragraphs: [t.INSTRUCTIONS_SKIP_TEXT],
        },
        {
          id: 9,
          icons: ["mdi-poker-chip"],
          title: t.INSTRUCTIONS_TRUCO_TITLE,
          paragraphs: [
            fmt(t.INSTRUCTIONS_TRUCO_TEXT_1),
            fmt(t.INSTRUCTIONS_TRUCO_TEXT_2),
            fmt(t.INSTRUCTIONS_TRUCO_TEXT_3),
          ],
        },
        {
          id: 10,
          icons: ["mdi-flag-variant"],
          title: t.INSTRUCTIONS_GIVEUP_TITLE,
          paragraphs: [t.INSTRUCTIONS_GIVEUP_TEXT],
        },
      ];
    },
  },
  mounted() {
    // Instância fora do `data` para o Vue não tornar o Swiper reativo
    this.swiper = new Swiper(this.$refs.swiper, {
      modules: [Autoplay, Keyboard, A11y],
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      observer: true,
      observeParents: true,
      resizeObserver: true,
      speed: INSTRUCTIONS_CONFIG.TRANSITION_SPEED,
      keyboard: { enabled: this.showControls },
      autoplay: {
        delay: INSTRUCTIONS_CONFIG.AUTOPLAY_DELAY,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
      },
      on: {
        realIndexChange: (swiper) => {
          this.activeIndex = swiper.realIndex;
        },
      },
    });
    // Recalcula depois que o layout e as fontes estabilizarem
    this.$nextTick(() => {
      if (this.swiper) this.swiper.update();
    });
  },
  beforeDestroy() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
    }
  },
  methods: {
    prev() {
      this.swiper.slidePrev();
    },
    next() {
      this.swiper.slideNext();
    },
    goTo(index) {
      this.swiper.slideToLoop(index);
    },
    toggleAutoplay() {
      if (this.isPlaying) {
        this.swiper.autoplay.stop();
      } else {
        this.swiper.autoplay.start();
      }
      this.isPlaying = !this.isPlaying;
    },
    iconSize(slide) {
      if (this.compact) return slide.icons.length > 2 ? 20 : 32;
      return slide.icons.length > 2 ? 48 : 72;
    },
  },
};
</script>

<style scoped src="./style.css"></style>
