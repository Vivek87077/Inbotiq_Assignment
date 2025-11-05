require("dotenv").config();

const config = {
  cartesia: {
    websocketUrl: "wss://api.cartesia.ai/tts/websocket",
    apiKey: process.env.CARTESIA_API_KEY || "your-cartesia-api-key",
    voice: "alloy", // Example voice ID from Cartesia
    sampleRate: 8000, // or 16000
  },
  telecmi: {
    websocketUrl:
      process.env.TELECMI_WEBSOCKET_URL || "wss://your-telecmi-endpoint", // Replace with actual TeleCMI WebSocket URL
    apiKey: process.env.TELECMI_API_KEY || "your-telecmi-api-key",
  },
  audio: {
    chunkDurationMs: 60,
    bytesPerChunk: (sampleRate) => sampleRate * 0.06 * 2, // 16-bit = 2 bytes per sample
  },
  logging: {
    level: "info",
  },
};

module.exports = config;
