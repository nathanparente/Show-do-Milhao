import {
  TOTAL_QUESTIONS,
  THEMES,
  THEME_KEYWORDS,
  PROGRESS_CONFIG,
} from "@/constants/game";

import {
  SYSTEM_PROMPT,
  DIFFICULTY_GUIDE,
  QUIZ_EXAMPLE,
} from "@/constants/quizPrompt";

export const GAME_CONFIG = Object.freeze({
  TOTAL_QUESTIONS,
  THEMES,

  _shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  },

  _getKeywords(temas) {
    return temas.flatMap((t) => THEME_KEYWORDS[t] || []);
  },

  _getLevel(index, quantidade) {
    const ratio = (index + 1) / quantidade;
    if (ratio <= 0.5) return "fácil";
    if (ratio <= 0.8) return "médio";
    return "difícil";
  },

  /**
   * Cria slots {id, nivel, topico}. Tópicos distribuídos aleatoriamente,
   * mas cada pergunta tem um alvo explícito (cobertura + validação).
   */
  _buildSlots(temas, quantidade) {
    const pool = this._getKeywords(temas);
    const topics = [];
    while (pool.length && topics.length < quantidade) {
      topics.push(...this._shuffleArray(pool));
    }
    return Array.from({ length: quantidade }, (_, i) => ({
      id: i + 1,
      nivel: this._getLevel(i, quantidade),
      topico: topics[i] || temas[i % temas.length],
    }));
  },

  _formatSlots(slots) {
    return slots
      .map(
        (s) =>
          `#${s.id} | ${s.nivel} (${DIFFICULTY_GUIDE[s.nivel]}) | tópico: ${
            s.topico
          }`
      )
      .join("\n");
  },

  /** Retorna as mensagens para /api/chat */
  GET_MESSAGES(temas, quantidade) {
    const slots = this._buildSlots(temas, quantidade);
    const user = `Crie ${quantidade} perguntas de múltipla escolha sobre: ${temas.join(
      ", "
    )}.

## Plano (uma pergunta por linha, na ordem)
${this._formatSlots(slots)}

## Exemplo de formato (não reutilize o conteúdo)
${QUIZ_EXAMPLE}`;

    return {
      slots,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: user },
      ],
    };
  },

  _buildSingleQuestionMessages(temas, slot) {
    const user = `Crie 1 pergunta de múltipla escolha sobre: ${temas.join(
      ", "
    )}.

#1 | ${slot.nivel} (${DIFFICULTY_GUIDE[slot.nivel]}) | tópico: ${slot.topico}

## Exemplo de formato (não reutilize o conteúdo)
${QUIZ_EXAMPLE}`;

    return [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: user },
    ];
  },

  /** Valida estrutura e tópico com base no slot */
  _validateQuestion(p, slot) {
    if (
      !p ||
      !p.pergunta ||
      !p.correta ||
      !Array.isArray(p.incorretas) ||
      p.incorretas.length !== 3
    ) {
      return false;
    }

    const all = [p.correta, ...p.incorretas].map((a) => a.trim().toLowerCase());
    if (new Set(all).size !== 4) return false; // alternativas duplicadas

    const words = (s) => s.trim().split(/\s+/).length;
    const lens = [p.correta, ...p.incorretas].map(words);
    if (Math.max(...lens) > 12) return false;
    if (words(p.correta) > Math.max(...p.incorretas.map(words)) + 2)
      return false;

    const haystack = `${p.fato || ""} ${p.pergunta} ${p.correta}`.toLowerCase();
    return haystack.includes(slot.topico.toLowerCase());
  },

  _getCharsPerQuestion() {
    const stored = parseInt(
      localStorage.getItem(PROGRESS_CONFIG.STORAGE_KEY),
      10
    );
    return stored > 0 ? stored : PROGRESS_CONFIG.DEFAULT_CHARS_PER_QUESTION;
  },

  /** Média móvel: a estimativa se ajusta ao modelo/máquina sem oscilar */
  _saveCharsPerQuestion(measured) {
    if (!measured || measured < 50) return;
    const current = this._getCharsPerQuestion();
    const smoothed = Math.round(current * 0.6 + measured * 0.4);
    localStorage.setItem(PROGRESS_CONFIG.STORAGE_KEY, String(smoothed));
  },

  /**
   * Converte o conteúdo parcial do stream em fração (0 a 1).
   * Combina perguntas concluídas (preciso) com caracteres recebidos (contínuo),
   * sem nunca ultrapassar a pergunta que ainda está sendo escrita.
   */
  _countDone(content) {
    return (content.match(/"incorretas"\s*:\s*\[[^\]]*\]/g) || []).length;
  },

  _streamRatio(content, quantidade, charsPerQuestion) {
    const done = (content.match(/"incorretas"\s*:\s*\[[^\]]*\]/g) || []).length;
    const byChars = content.length / (charsPerQuestion * quantidade);
    const ceiling = Math.min((done + 1) / quantidade, 1) * 0.98;
    return Math.min(Math.max(done / quantidade, Math.min(byChars, ceiling)), 1);
  },

  /**
   * @param {Function} generateFn - (messages, onChunk) => Promise<JSON>
   * @param {Function} onProgress - recebe { percent, phase }
   */
  async GENERATE_VALIDATED_QUIZ(
    generateFn,
    temas,
    quantidade,
    { onProgress = () => {}, maxRetries = 2 } = {}
  ) {
    const { WAITING_MAX, GENERATION_END, REGENERATION_END } = PROGRESS_CONFIG;
    const charsPerQuestion = this._getCharsPerQuestion();
    const { slots, messages } = this.GET_MESSAGES(temas, quantidade);

    // ── Fase 1: geração principal ──
    let totalChars = 0;
    const raw = await generateFn(messages, (content) => {
      totalChars = content.length;
      const ratio = this._streamRatio(content, quantidade, charsPerQuestion);
      onProgress({
        phase: "generating",
        percent: WAITING_MAX + ratio * (GENERATION_END - WAITING_MAX),
        current: Math.min(this._countDone(content) + 1, quantidade),
        total: quantidade,
      });
    });
    this._saveCharsPerQuestion(totalChars / quantidade);

    const perguntas = slots.map((_, i) => (raw.perguntas || [])[i] || null);
    onProgress({ phase: "validating", percent: GENERATION_END });

    // ── Fase 2: validação e regeneração ──
    let base = GENERATION_END;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const failed = slots
        .map((slot, i) =>
          this._validateQuestion(perguntas[i], slot) ? null : i
        )
        .filter((i) => i !== null);

      if (!failed.length || attempt === maxRetries) break;

      console.warn(
        `[Quiz] Tentativa ${attempt + 1}: regenerando ${
          failed.length
        } pergunta(s).`
      );

      // Cada tentativa usa metade do espaço restante: a barra nunca "estoura"
      const range = (REGENERATION_END - base) / 2;
      const step = range / failed.length;

      for (let k = 0; k < failed.length; k++) {
        const i = failed[k];
        const stepStart = base + k * step;
        const res = await generateFn(
          this._buildSingleQuestionMessages(temas, slots[i]),
          (content) => {
            const ratio = this._streamRatio(content, 1, charsPerQuestion);
            onProgress({
              phase: "regenerating",
              percent: stepStart + ratio * step,
              current: k + 1,
              total: failed.length,
            });
          }
        );
        if (res && res.perguntas && res.perguntas[0]) {
          perguntas[i] = res.perguntas[0];
        }
      }
      base += range;
    }

    onProgress({ phase: "done", percent: REGENERATION_END });

    return {
      // eslint-disable-next-line no-unused-vars
      perguntas: perguntas.filter(Boolean).map(({ fato, id, ...p }) => p),
    };
  },
});
