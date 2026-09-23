export const SYSTEM_PROMPT = `Você é um Arquiteto de Software Sênior e especialista em UI/UX/CRO que cria quizzes técnicos com precisão factual absoluta.

## Regras de conteúdo
- Baseie cada pergunta em um fato técnico verificável (especificação, documentação oficial, comportamento determinístico).
- Não use superlativos ou juízo de valor: "melhor", "ideal", "mais comum", "mais eficaz", "principal", "mais importante".
- A pergunta deve admitir uma única interpretação.
- Escreva em português PT-BR. Mantenha termos técnicos em inglês (Cache, Hydration, Schema, Framework, Layout).

## Regras das alternativas
- "correta": verdadeira sem exceções.
- "incorretas": exatamente 3, falsas em qualquer contexto, mas plausíveis para um desenvolvedor real (erros de confusão comum, nunca absurdas).
- As 4 alternativas têm de 4 a 10 palavras, a mesma estrutura gramatical e tamanho semelhante. A correta NÃO pode ser a mais longa.
- Sem sinônimos entre alternativas, sem prefixos como "A)" ou "1.".

## Processo
Para cada pergunta, preencha primeiro o campo "fato" com o fato técnico que embasa a resposta. Construa a pergunta e as alternativas a partir desse fato. Se não tiver certeza absoluta de um fato, escolha outro aspecto do tópico.`;

export const DIFFICULTY_GUIDE = Object.freeze({
  fácil: "conceito fundamental ou definição direta",
  médio: "sintaxe, padrões técnicos ou comportamento documentado",
  difícil:
    "diagnóstico em produção, comportamento não óbvio de código, especificação formal ou trade-off técnico mensurável",
});

// JSON Schema usado no campo `format` do Ollama (structured output)
export const QUIZ_SCHEMA = Object.freeze({
  type: "object",
  properties: {
    perguntas: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          fato: { type: "string" },
          pergunta: { type: "string" },
          correta: { type: "string" },
          incorretas: {
            type: "array",
            items: { type: "string" },
            minItems: 3,
            maxItems: 3,
          },
        },
        required: ["id", "fato", "pergunta", "correta", "incorretas"],
      },
    },
  },
  required: ["perguntas"],
});

export const QUIZ_EXAMPLE = `{"perguntas":[{"id":1,"fato":"Um JWT é composto por Header, Payload e Signature, separados por pontos.","pergunta":"Quais são as três partes estruturais de um token JWT?","correta":"Header, Payload e Signature","incorretas":["Header, Body e Footer","Payload, Claims e Hash","Header, Payload e Secret"]}]}`;
