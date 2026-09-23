import { OLLAMA_CONFIG } from "../config/ollamaConfig";
import { QUIZ_SCHEMA } from "../constants/quizPrompt";

async function callOllama(messages, { format, options } = {}) {
  const res = await fetch(OLLAMA_CONFIG.URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_CONFIG.MODEL_NAME,
      messages,
      stream: false,
      ...(format && { format }),
      options: { ...OLLAMA_CONFIG.OPTIONS, ...options },
    }),
  });

  if (!res.ok) {
    throw new Error(`Ollama respondeu ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  return data.message.content;
}

/** Geração do quiz: retorna objeto JSON validado pelo schema */
export async function generateFn(messages) {
  const content = await callOllama(messages, { format: QUIZ_SCHEMA });
  return JSON.parse(content);
}
