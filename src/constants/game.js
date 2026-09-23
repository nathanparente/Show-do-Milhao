export const TOTAL_QUESTIONS = 15;

export const THEMES = Object.freeze(["Desenvolvimento Web", "UI/UX", "CRO"]);

export const THEME_KEYWORDS = Object.freeze({
  "Desenvolvimento Web": [
    "git",
    "gitflow",
    "recursividade",
    "loops",
    "pipeline",
    "css",
    "javascript",
    "styleguide",
    "wordpress",
    "next.js",
    "typescript",
    "APIs",
    "autenticação",
    "captcha",
    "inputs",
    "core web vitals",
    "SQL",
    "CORS",
    "JWT",
    "REST",
    "DOM",
    "LocalStorage",
    "Heading tags",
    "HTML Semantic tags",
  ],
  "UI/UX": [
    "Figma",
    "Google Web Design",
    "Grids",
    "Breakpoints",
    "Responsividade",
    "Acessibilidade",
    "Análise Heurística",
    "Teste A/B",
    "Hierarquia Visual",
    "Legibilidade",
    "Personas",
    "WCAG",
    "Navegação por teclado",
    "Contraste de cores",
    "CTA Button",
    "Layout",
    "SEO",
  ],
  CRO: [
    "NPS",
    "Métricas Financeiras Básicas",
    "Teste A/B",
    "Social Proof",
    "Primeira Impressão Visual",
    "Pesquisa de Usabilidade",
    "GTM vs. Gtag",
    "Gatilhos de Captura",
    "Parâmetros de Teste",
    "Definição de Métricas e MDE",
    "Vieses Cognitivos",
    "7 Níveis de Conversão",
    "Pesquisas Qualitativas e Quantitativas",
    "Análise Heurística",
    "Dinâmicas de Ideação",
    "Ajustes de Múltiplas Comparações",
  ],
});

export const PLAYOFFS_SCORING = Object.freeze({
  NORMAL_WIN_POINTS: 5,
  TRUCO_SIMPLE_WIN_POINTS: 10,
  TRUCO_DOUBLE_WIN_POINTS: 20,
  TRUCO_SIMPLE_ERROR_PENALTY: 10,
  TRUCO_DOUBLED_ERROR_PENALTY: 20,
});

export const MILLION_GAME_CONFIG = Object.freeze({
  STORAGE_KEY: "millionScore",
  QUESTION_VALUE: 1000,
});

export const PROGRESS_CONFIG = Object.freeze({
  STORAGE_KEY: "quizCharsPerQuestion",
  DEFAULT_CHARS_PER_QUESTION: 450, // valor inicial; é recalibrado a cada partida
  WAITING_MAX: 8, // % máximo enquanto espera o primeiro token
  GENERATION_END: 85, // % ao terminar a geração principal
  REGENERATION_END: 97, // % ao terminar as regenerações
});
