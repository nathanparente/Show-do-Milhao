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

/**
 * Gera o quiz via streaming.
 * @param {Array} messages - mensagens do /api/chat
 * @param {Function} onChunk - recebe o conteúdo acumulado a cada token
 * @returns {Object} JSON final já parseado
 */
export async function generateFn(messages, onChunk = () => {}) {
  const res = await fetch(OLLAMA_CONFIG.URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_CONFIG.MODEL_NAME,
      messages,
      format: QUIZ_SCHEMA,
      stream: true,
      options: OLLAMA_CONFIG.OPTIONS,
    }),
  });

  if (!res.ok) {
    throw new Error(`Ollama respondeu ${res.status}: ${await res.text()}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let content = "";

  // O Ollama envia NDJSON: um objeto JSON por linha
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop(); // linha incompleta fica para a próxima leitura

    for (const line of lines) {
      if (!line.trim()) continue;
      const chunk = JSON.parse(line);
      if (chunk.message && chunk.message.content) {
        content += chunk.message.content;
        onChunk(content);
      }
    }
  }

  return JSON.parse(content);
}
