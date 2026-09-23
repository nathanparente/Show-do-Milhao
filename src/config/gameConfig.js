import { TOTAL_QUESTIONS, THEMES, THEME_KEYWORDS } from "@/constants/game";
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

  /**
   * generateFn(messages) -> objeto JSON (usa format: QUIZ_SCHEMA)
   */
  async GENERATE_VALIDATED_QUIZ(generateFn, temas, quantidade, maxRetries = 2) {
    const { slots, messages } = this.GET_MESSAGES(temas, quantidade);
    const raw = await generateFn(messages);
    const perguntas = slots.map((_, i) => (raw.perguntas || [])[i] || null);

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

      for (const i of failed) {
        const res = await generateFn(
          this._buildSingleQuestionMessages(temas, slots[i])
        );
        if (res && res.perguntas && res.perguntas[0]) {
          perguntas[i] = res.perguntas[0]; // revalidada no próximo loop
        }
      }
    }

    return {
      // eslint-disable-next-line no-unused-vars
      perguntas: perguntas.filter(Boolean).map(({ fato, id, ...p }) => p),
    };
  },
});
