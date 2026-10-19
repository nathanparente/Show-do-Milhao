import {
  TOTAL_QUESTIONS,
  PLAYOFFS_SCORING,
  PLAYOFFS_TIMER_SECONDS,
  MILLION_GAME_CONFIG,
} from "@/constants/game";

const CONFIG_KEY = "userGameConfig";

export const getSavedConfig = () => {
  const saved = localStorage.getItem(CONFIG_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Erro ao ler configuração", e);
    }
  }
  return null;
};

export const saveConfig = (config) => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
};

export const clearConfig = () => {
  localStorage.removeItem(CONFIG_KEY);
};

// Função auxiliar segura para valores numéricos e booleanos
const getVal = (val, fallback) => {
  return val !== undefined && val !== null ? val : fallback;
};

export const getConfig = () => {
  const saved = getSavedConfig() || {};
  const pScoring = saved.PLAYOFFS_SCORING || {};
  const pTimer = saved.PLAYOFFS_TIMER_SECONDS || {};
  const mConfig = saved.MILLION_GAME_CONFIG || {};
  const helps = saved.ACTIVE_HELPS || {};

  return {
    TOTAL_QUESTIONS: getVal(saved.TOTAL_QUESTIONS, TOTAL_QUESTIONS),
    PLAYOFFS_SCORING: {
      NORMAL_WIN_POINTS: getVal(
        pScoring.NORMAL_WIN_POINTS,
        PLAYOFFS_SCORING.NORMAL_WIN_POINTS
      ),
      TRUCO_SIMPLE_WIN_POINTS: getVal(
        pScoring.TRUCO_SIMPLE_WIN_POINTS,
        PLAYOFFS_SCORING.TRUCO_SIMPLE_WIN_POINTS
      ),
      TRUCO_DOUBLE_WIN_POINTS: getVal(
        pScoring.TRUCO_DOUBLE_WIN_POINTS,
        PLAYOFFS_SCORING.TRUCO_DOUBLE_WIN_POINTS
      ),
      TRUCO_SIMPLE_ERROR_PENALTY: getVal(
        pScoring.TRUCO_SIMPLE_ERROR_PENALTY,
        PLAYOFFS_SCORING.TRUCO_SIMPLE_ERROR_PENALTY
      ),
      TRUCO_DOUBLED_ERROR_PENALTY: getVal(
        pScoring.TRUCO_DOUBLED_ERROR_PENALTY,
        PLAYOFFS_SCORING.TRUCO_DOUBLED_ERROR_PENALTY
      ),
    },
    PLAYOFFS_TIMER_SECONDS: {
      TIMER_SECONDS: getVal(
        pTimer.TIMER_SECONDS,
        PLAYOFFS_TIMER_SECONDS.TIMER_SECONDS
      ),
    },
    MILLION_GAME_CONFIG: {
      QUESTION_VALUE: getVal(
        mConfig.QUESTION_VALUE,
        MILLION_GAME_CONFIG.QUESTION_VALUE
      ),
    },
    ACTIVE_HELPS: {
      playoffs: helps.playoffs || {
        cartas: true,
        ia: true,
        universitarios: true,
        pulo: false,
        truco: true,
      },
      million_game: helps.million_game || {
        cartas: true,
        ia: true,
        universitarios: true,
        pulo: true,
        truco: false,
      },
    },
  };
};
