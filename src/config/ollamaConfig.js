export const OLLAMA_CONFIG = Object.freeze({
  URL: "http://localhost:11434/api/chat",
  MODEL_NAME: "llama3.1",
  OPTIONS: Object.freeze({
    temperature: 0.6,
    top_p: 0.9,
    num_ctx: 16384, // 16k tokens (ou 8192 para máquinas com menos VRAM)
    repeat_penalty: 1.1,
  }),
});
