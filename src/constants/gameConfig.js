const TOTAL_QUESTIONS = 5;
const THEMES = ["Desenvolvimento Web", "UI/UX", "CRO"];

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

export const GAME_CONFIG = Object.freeze({
  TOTAL_QUESTIONS,
  THEMES,
  OLLAMA_URL: "http://localhost:11434/api/generate",
  MODEL_NAME: "llama3.1",
  TEMPERATURE: 0.2,

  /**
   * Embaralha um array usando Fisher-Yates (não muta o original).
   */
  _shuffleArray: (arr) => {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  },

  /**
   * Distribui as keywords de forma ALEATÓRIA entre as perguntas.
   * O objetivo NÃO é ditar a ordem das perguntas, mas garantir que,
   * internamente, cada pergunta tenha um tópico-alvo para fins de
   * cobertura de escopo e validação — sem viés de ordem do array original.
   */
  _buildKeywordAssignment: function (temas, quantidade) {
    const selectedKeywords = temas
      .map((tema) => THEME_KEYWORDS[tema] || [])
      .flat();

    if (selectedKeywords.length === 0) {
      return { assignedKeywords: [], mappingText: "", poolText: "" };
    }

    // 1. Embaralha o pool de keywords (usado apenas para exibição no prompt)
    const shuffledPool = this._shuffleArray(selectedKeywords);

    // 2. Se quantidade > pool, repete o pool embaralhado quantas vezes
    //    forem necessárias, embaralhando de novo em cada "volta" para
    //    evitar repetição de padrão previsível.
    const assignedKeywords = [];
    while (assignedKeywords.length < quantidade) {
      const rodada = this._shuffleArray(selectedKeywords);
      for (const kw of rodada) {
        if (assignedKeywords.length >= quantidade) break;
        assignedKeywords.push(kw);
      }
    }

    // 3. Embaralha o resultado final novamente para quebrar qualquer
    //    resquício de agrupamento por "rodada"
    const finalAssignment = this._shuffleArray(assignedKeywords);

    // Usado apenas internamente para validação de cobertura (NÃO exibido
    // ao LLM como "Pergunta X = keyword Y", pois isso reintroduziria
    // viés de ordem sequencial).
    const mappingText = finalAssignment
      .map((kw, i) => `#${i + 1}: "${kw}"`)
      .join(", ");

    const poolText = shuffledPool.join(", ");

    return { assignedKeywords: finalAssignment, mappingText, poolText };
  },

  /**
   * Retorna os índices (0-based) das perguntas classificadas como
   * NÍVEL DIFÍCIL, com base na mesma lógica de curva de dificuldade
   * usada no GET_PROMPT.
   */
  _getHardQuestionIndexes: (quantidade) => {
    const mediumEnd = Math.floor(quantidade * 0.8);
    const hardStartIndex = mediumEnd; // 0-based: próximo índice após o médio
    const indexes = [];
    for (let i = hardStartIndex; i < quantidade; i++) {
      indexes.push(i);
    }
    return indexes;
  },

  GET_PROMPT: function (temas, quantidade) {
    const easyEnd = Math.floor(quantidade * 0.5);
    const mediumStart = easyEnd + 1;
    const mediumEnd = Math.floor(quantidade * 0.8);
    const hardStart = mediumEnd + 1;

    const easyRangeText =
      easyEnd === 1 ? "Pergunta 1" : `Perguntas 1 até ${easyEnd}`;
    const mediumRangeText =
      mediumStart === mediumEnd
        ? `Pergunta ${mediumStart}`
        : `Perguntas ${mediumStart} até ${mediumEnd}`;
    const hardRangeText =
      hardStart === quantidade
        ? `Pergunta ${quantidade}`
        : `Perguntas ${hardStart} até ${quantidade}`;

    const { poolText } = this._buildKeywordAssignment(temas, quantidade);

    const keywordsBlock = poolText
      ? `
ESCOPO TÉCNICO OBRIGATÓRIO:
As perguntas devem se manter estritamente dentro do seguinte conjunto de tópicos/tecnologias: ${poolText}.

IMPORTANTE SOBRE A ORDEM: A lista acima está em ORDEM ALEATÓRIA e serve APENAS como delimitação
de escopo/conhecimento permitido. Você NÃO deve seguir a ordem de aparição da lista, ordem
alfabética, ou qualquer padrão sequencial ao criar as perguntas. Distribua os tópicos de forma
variada e não repetitiva entre as ${quantidade} perguntas, cobrindo o máximo de tópicos distintos
possível. A ÚNICA ordem que importa é a CURVA DE DIFICULDADE definida abaixo (fácil → médio → difícil).
`
      : "";

    return `
Você é um Arquiteto de Software Sênior e Especialista em UI/UX/CRO criando um quiz técnico de precisão absoluta.
Crie exatas ${quantidade} perguntas de múltipla escolha sobre os temas: ${temas.join(
      ", "
    )}.
${keywordsBlock}

CURVA DE DIFICULDADE PROGRESSIVA POR PORCENTAGEM (esta é a ÚNICA ordem relevante):
- ${easyRangeText} (0% a 50% - NÍVEL FÁCIL): Conceitos fundamentais e definições diretas.
- ${mediumRangeText} (50% a 80% - NÍVEL MÉDIO): Sintaxe, padrões técnicos e boas práticas.
- ${hardRangeText} (80% a 100% - NÍVEL DIFÍCIL/ESPECIALISTA): Diagnósticos avançados em produção, comportamento de código, especificações formais e trade-offs críticos.

REGRAS DE OURO PARA EVITAR ERROS E AMBIGUIDADE (OBRIGATÓRIO):
1. PROIBIDO SUBJETIVIDADE E SUPERLATIVOS: É ESTRITAMENTE PROIBIDO usar palavras como "mais comum", "mais eficaz", "melhor", "mais importante", "ideal" ou "principal".
2. APENAS FATOS DETERMINÍSTICOS: As perguntas devem ser baseadas em fatos técnicos inquestionáveis, sem interpretação ou contexto ambíguo.
3. APENAS TEXTO EM PORTUGUÊS PT-BR: Todos os textos devem estar em português correto.
4. TERMOS TÉCNICOS EM INGLÊS (en): Termos técnicos como Cache, User-Agent, Framework, Hydration, Schema, Layout, Dataset, entre outros, devem permanecer em inglês.
5. ALTERNATIVAS SIMÉTRICAS E CURTAS: As 4 alternativas DEVEM ter frases curtas de 4 a 10 palavras. A correta não pode ser visivelmente mais longa que as incorretas.
6. 1 CORRETA E 3 INCORRETAS INDISCUTÍVEIS: A correta deve ser categoricamente verdadeira, sem exceções. As 3 incorretas devem ser categoricamente falsas.

REGRAS DE QUALIDADE DOS DISTRACTORS (ALTERNATIVAS INCORRETAS):
7. PLAUSIBILIDADE OBRIGATÓRIA: Cada alternativa incorreta deve ser algo que um desenvolvedor real poderia confundir com a resposta certa.
8. PROIBIDO ALTERNATIVAS ABSURDAS: Evite alternativas nonsense que tornem a pergunta fácil por eliminação.
9. MESMA CATEGORIA GRAMATICAL/SINTÁTICA: Mantenha o mesmo tipo de estrutura entre as 4 alternativas.
10. SEM SOBREPOSIÇÃO SEMÂNTICA: As alternativas não podem ser sinônimas entre si ou reformulações da mesma ideia.

AUTOVERIFICAÇÃO OBRIGATÓRIA (execute mentalmente antes de finalizar cada pergunta):
a) A alternativa "correta" é 100% factualmente correta, sem exceções?
b) As 3 "incorretas" são categoricamente falsas, sem chance de estarem certas em algum contexto?
c) Existe apenas UMA interpretação possível para a pergunta?
Se qualquer resposta for "não" ou "talvez", REFAÇA a pergunta antes de incluí-la no JSON final.

EXEMPLO DE ERRO A EVITAR (NÃO REPITA ESTE PADRÃO):
❌ Pergunta: "O que é JWT?"
❌ Correta: "Um token"
❌ Incorretas: ["Um cookie", "Um header", "Uma sessão"]
(Motivo: resposta vaga e alternativas não são mutuamente exclusivas)

✅ Padrão correto:
Pergunta: "Quais são as três partes que compõem estruturalmente um token JWT?"
Correta: "Header, Payload e Signature"
Incorretas: ["Header, Body e Footer", "Payload, Token e Hash", "Key, Value e Signature"]

REGRAS DE FORMATO:
1. "correta": Texto puro e curto da alternativa certa. NUNCA coloque letras (A, B, C, D).
2. "incorretas": Array com EXATAMENTE 3 alternativas erradas e curtas.
3. PROIBIDO prefixos como "A)", "B)", "1.".
4. Responda APENAS com o JSON, sem texto adicional antes ou depois.

Siga rigorosamente este formato JSON:
{
  "perguntas": [
    {
      "pergunta": "Qual método do JavaScript cancela o comportamento padrão de um evento sem interromper sua propagação?",
      "correta": "Uso do método event.preventDefault()",
      "incorretas": [
        "Uso do método event.stopPropagation()",
        "Uso do método event.stopImmediatePropagation()",
        "Uso da propriedade event.cancelBubble"
      ]
    },
    {
      "pergunta": "Qual é a razão de contraste mínima exigida pelas diretrizes WCAG 2.1 no nível AA para texto normal?",
      "correta": "Razão de contraste mínima de 4.5:1",
      "incorretas": [
        "Razão de contraste mínima de 3.0:1",
        "Razão de contraste mínima de 7.0:1",
        "Razão de contraste mínima de 2.1:1"
      ]
    },
    {
      "pergunta": "Qual valor de p (p-value) é utilizado para comprovar estatisticamente 95% de confiança em um teste A/B?",
      "correta": "Valor de p inferior a 0.05",
      "incorretas": [
        "Valor de p inferior a 0.50",
        "Valor de p superior a 0.95",
        "Valor de p igual a 1.00"
      ]
    }
  ]
}
    `;
  },

  /**
   * Valida cobertura de keyword de forma FLEXÍVEL: não exige que a
   * pergunta N corresponda exatamente à keyword N do array (isso não
   * faz mais sentido, já que a ordem é aleatória e a LLM decide livremente
   * dentro do escopo). Em vez disso, verifica se o CONJUNTO de perguntas
   * gerado, como um todo, referencia pelo menos algumas das keywords do pool.
   *
   * Cada pergunta recebe _keywordOk = true se contiver QUALQUER keyword
   * válida do pool (não uma específica pré-atribuída).
   */
  VALIDATE_KEYWORD_COVERAGE: function (perguntas, temas) {
    const selectedKeywords = temas
      .map((tema) => THEME_KEYWORDS[tema] || [])
      .flat()
      .map((kw) => kw.toLowerCase());

    if (selectedKeywords.length === 0) {
      return perguntas.map((p) => Object.assign({}, p, { _keywordOk: true }));
    }

    return perguntas.map((p) => {
      const haystack = (p.pergunta + " " + p.correta).toLowerCase();
      const matchedKeyword = selectedKeywords.find(
        (kw) => haystack.indexOf(kw) !== -1
      );

      return Object.assign({}, p, {
        _matchedKeyword: matchedKeyword || null,
        _keywordOk: Boolean(matchedKeyword),
      });
    });
  },

  /**
   * Verifica se a resposta correta está de fato correta, fazendo uma
   * segunda chamada isolada ao modelo.
   */
  VERIFY_ANSWER: async function (pergunta, ollamaCall) {
    const alternativas = [
      pergunta.correta,
      pergunta.incorretas[0],
      pergunta.incorretas[1],
      pergunta.incorretas[2],
    ];
    const shuffled = alternativas.slice().sort(function () {
      return Math.random() - 0.5;
    });

    const verificationPrompt =
      "Você é um revisor técnico rigoroso. Analise a pergunta e as alternativas abaixo.\n\n" +
      'Pergunta: "' +
      pergunta.pergunta +
      '"\n\n' +
      "Alternativas:\n" +
      shuffled
        .map(function (alt, i) {
          return i + 1 + ". " + alt;
        })
        .join("\n") +
      "\n\nResponda APENAS com o número da alternativa tecnicamente correta. Nenhum texto adicional.";

    const response = await ollamaCall(verificationPrompt);
    const match = response.trim().match(/\d+/);
    const chosenNumber = match ? parseInt(match[0], 10) : -1;
    const chosenIndex = chosenNumber - 1;
    const chosenItem = shuffled[chosenIndex];
    const chosenText = chosenItem ? chosenItem.trim() : "";

    return {
      isValid: chosenText === pergunta.correta.trim(),
      modelChose: chosenText,
      expected: pergunta.correta,
    };
  },

  /**
   * Orquestra geração + validação.
   * - Keyword coverage: valida se cada pergunta usa PELO MENOS uma
   *   keyword do pool (sem exigir uma keyword pré-determinada por índice).
   * - Verify Answer (dupla checagem via LLM): roda SOMENTE nas perguntas
   *   classificadas como nível difícil, economizando chamadas ao Ollama.
   */
  GENERATE_VALIDATED_QUIZ: async function (
    generateFn,
    ollamaCallFn,
    temas,
    quantidade,
    maxRetries
  ) {
    const retries = maxRetries || 2;

    const rawResult = await generateFn(this.GET_PROMPT(temas, quantidade));
    let perguntas = this.VALIDATE_KEYWORD_COVERAGE(rawResult.perguntas, temas);

    const hardIndexes = this._getHardQuestionIndexes(quantidade);

    for (let attempt = 0; attempt < retries; attempt++) {
      // Checa cobertura de keyword em TODAS as perguntas
      const keywordFailures = perguntas
        .map((p, i) => ({ i: i, ok: p._keywordOk }))
        .filter(function (r) {
          return !r.ok;
        })
        .map(function (r) {
          return r.i;
        });

      // Verificação dupla (LLM re-checa a resposta) SOMENTE nas difíceis
      const hardVerifications = await Promise.all(
        hardIndexes.map(async (idx) => {
          const result = await this.VERIFY_ANSWER(perguntas[idx], ollamaCallFn);
          return { i: idx, ok: result.isValid, details: result };
        })
      );

      const answerFailures = hardVerifications
        .filter(function (r) {
          return !r.ok;
        })
        .map(function (r) {
          return r.i;
        });

      const failedIndexesSet = new Set(keywordFailures.concat(answerFailures));
      const failedIndexes = Array.from(failedIndexesSet);

      if (failedIndexes.length === 0) break;

      console.warn(
        "[Quiz Validation] Tentativa " +
          (attempt + 1) +
          ": " +
          failedIndexes.length +
          " pergunta(s) precisam ser regeneradas."
      );

      // Pool de keywords disponível para sortear novos tópicos na regeneração
      const selectedKeywords = temas
        .map((tema) => THEME_KEYWORDS[tema] || [])
        .flat();

      for (const idx of failedIndexes) {
        const targetKeyword =
          selectedKeywords.length > 0
            ? selectedKeywords[
                Math.floor(Math.random() * selectedKeywords.length)
              ]
            : null;

        const singlePrompt = this._buildSingleQuestionPrompt(
          temas,
          targetKeyword,
          hardIndexes.indexOf(idx) !== -1 ? "difícil" : "fácil/médio"
        );

        const novaPergunta = await generateFn(singlePrompt);
        if (
          novaPergunta &&
          novaPergunta.perguntas &&
          novaPergunta.perguntas[0]
        ) {
          perguntas[idx] = Object.assign({}, novaPergunta.perguntas[0], {
            _keywordOk: true,
            _matchedKeyword: targetKeyword,
          });
        }
      }
    }

    return { perguntas: perguntas };
  },

  /**
   * Gera o prompt para regenerar UMA única pergunta, focada em uma
   * keyword específica (sorteada aleatoriamente do pool) e em um
   * nível de dificuldade específico.
   */
  _buildSingleQuestionPrompt: function (temas, keyword, nivel) {
    const topicoLine = keyword
      ? `TÓPICO OBRIGATÓRIO: A pergunta DEVE abordar diretamente "${keyword}".`
      : "";

    return `
Você é um Arquiteto de Software Sênior criando UMA única pergunta de múltipla escolha técnica de precisão absoluta sobre: ${temas.join(
      ", "
    )}.

${topicoLine}
NÍVEL DE DIFICULDADE: ${nivel}.

REGRAS OBRIGATÓRIAS:
1. PROIBIDO superlativos ou subjetividade ("melhor", "ideal", "mais eficaz").
2. Fato técnico determinístico e inquestionável.
3. Texto em português PT-BR, termos técnicos em inglês.
4. 4 alternativas curtas (4-10 palavras), simétricas em tamanho.
5. Alternativas incorretas devem ser plausíveis (não absurdas) e sem sobreposição semântica.
6. Apenas 1 resposta correta indiscutível.

Responda APENAS com o JSON no formato:
{
  "perguntas": [
    {
      "pergunta": "...",
      "correta": "...",
      "incorretas": ["...", "...", "..."]
    }
  ]
}
    `;
  },
});

export const UI_TEXTS = Object.freeze({
  //LOADING SCREEN
  LOADING_TITLE: "Nossa LLama Tech está gerando as perguntas do jogo...",
  LOADING_SUBTITLE: "Já pensou no que vai gastar quando ganhar um milhão ?",

  //LOST GAME
  LOST_GAME_MODAL_TEXT:
    "Uai, já acabou ? Não foi dessa vez! Fique com uma pipoquinha de consolação 🍿",
  LOST_MILLION_GAME_TEXT: "Total: ",

  //ERRORS
  ERROR_TITLE: "Não foi possível conectar ao Ollama local.",
  ERROR_SUBTITLE: 'Verifique se o serviço está ativo com OLLAMA_ORIGINS="*".',
  ERROR_BUTTON: "Tentar Novamente",

  //VICTORY
  WIN_MESSAGE:
    "🎉 PARABÉNS! Você respondeu todas as perguntas do Show do Milhão!",

  //IA
  HELP_GEPETO: "Segundo o Gepeto, nossa IA que nunca mente (EU ACHO) ...",

  //UNIVERSITARIOS
  HELP_UNIVERSITARIOS:
    "Agora é a hora de contar com a força da amizade,<br /> pergunte para seus amigos se eles sabem",

  //CARDS
  HELP_CARTAS_INSTRUCTION:
    "Escolha uma carta para revelar quantas alternativas erradas serão eliminadas:",

  //HELPERS
  HELP_CARTAS_NONE: "Nenhuma alternativa errada foi eliminada!",
  HELP_CARTAS_ONE_OPTION: "1 alternativa errada foi eliminada.",
  HELP_CARTAS_SELECTED_OPTIONS: "alternativas erradas foram eliminadas.",

  //PLAYOFFS
  PLAYOFFS_TURN_LOST_TITLE: "ops! Você errou e perdeu a vez",
  PLAYOFFS_TURN_LOST_SUBTITLE: "Você perdeu metade dos seus pontos.",
  PLAYOFFS_CONTINUE_BUTTON: "Continuar Jogo",
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
