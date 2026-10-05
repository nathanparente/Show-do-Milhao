export const OLLAMA_CONFIG = Object.freeze({
  URL: "http://localhost:11434/api/chat",
  MODEL_NAME: "qwen2.5:14b",
  OPTIONS: Object.freeze({
    temperature: 0.8,
    top_p: 0.9,
    num_ctx: 2048,
    repeat_penalty: 1.1,
  }),
});
