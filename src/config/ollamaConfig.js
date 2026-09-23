export const OLLAMA_CONFIG = Object.freeze({
  URL: "http://localhost:11434/api/chat",
  MODEL_NAME: "llama3.1",
  OPTIONS: Object.freeze({
    temperature: 0.4,
    top_p: 0.9,
    num_ctx: 8192,
    repeat_penalty: 1.1,
  }),
});
