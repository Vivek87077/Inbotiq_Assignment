const WebSocket = require("ws");
const logger = require("./logger");
const config = require("./config");

class AudioScheduler {
  constructor() {
    this.cartesiaWs = null;
    this.telecmiWs = null;
    this.audioBuffer = Buffer.alloc(0);
    this.chunkSize = config.audio.bytesPerChunk(config.cartesia.sampleRate);
    this.intervalId = null;
    this.isStreaming = false;
  }

  async start(text) {
    try {
      await this.connectToCartesia();
      await this.connectToTelecmi();
      this.startPacing();
      this.sendTextToCartesia(text);
      logger.info("Audio scheduler started");
    } catch (error) {
      logger.error("Failed to start audio scheduler", error);
      this.stop();
    }
  }

  stop() {
    this.isStreaming = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.cartesiaWs) {
      this.cartesiaWs.close();
      this.cartesiaWs = null;
    }
    if (this.telecmiWs) {
      this.telecmiWs.close();
      this.telecmiWs = null;
    }
    logger.info("Audio scheduler stopped");
  }

  async connectToCartesia() {
    return new Promise((resolve, reject) => {
      // For demo purposes, simulate Cartesia connection
      logger.info("Simulating Cartesia WebSocket connection (demo mode)");
      setTimeout(() => {
        logger.info("Connected to Cartesia WebSocket (simulated)");
        resolve();
      }, 100);
    });
  }

  async connectToTelecmi() {
    return new Promise((resolve, reject) => {
      // For demo purposes, simulate TeleCMI connection
      logger.info("Simulating TeleCMI WebSocket connection (demo mode)");
      setTimeout(() => {
        logger.info("Connected to TeleCMI WebSocket (simulated)");
        resolve();
      }, 100);
    });
  }

  sendTextToCartesia(text) {
    // Simulate sending text to Cartesia and receiving audio chunks
    logger.info(`Simulating TTS for text: "${text}"`);
    setTimeout(() => {
      // Simulate receiving variable-length audio chunks
      const sampleChunks = [
        Buffer.alloc(500, 0xaa), // 500 bytes
        Buffer.alloc(300, 0xbb), // 300 bytes
        Buffer.alloc(700, 0xcc), // 700 bytes
        Buffer.alloc(200, 0xdd), // 200 bytes
      ];

      sampleChunks.forEach((chunk, index) => {
        setTimeout(() => {
          this.handleCartesiaMessage(chunk);
          logger.debug(
            `Simulated audio chunk ${index + 1} of ${chunk.length} bytes`
          );
        }, index * 50); // Simulate variable timing
      });

      // Mark streaming as complete after all chunks
      setTimeout(() => {
        this.isStreaming = false;
        logger.info("TTS simulation completed");
      }, sampleChunks.length * 50 + 100);
    }, 200);
  }

  handleCartesiaMessage(data) {
    try {
      // Assuming data is Buffer for audio chunks
      if (Buffer.isBuffer(data)) {
        this.audioBuffer = Buffer.concat([this.audioBuffer, data]);
        logger.debug(`Received audio chunk of ${data.length} bytes`);
      } else {
        // Handle JSON messages if any
        const message = JSON.parse(data.toString());
        logger.info("Received JSON message from Cartesia", message);
        if (message.done) {
          this.isStreaming = false;
        }
      }
    } catch (error) {
      logger.error("Error handling Cartesia message", error);
    }
  }

  startPacing() {
    this.isStreaming = true;
    this.intervalId = setInterval(() => {
      if (this.audioBuffer.length >= this.chunkSize) {
        const chunk = this.audioBuffer.slice(0, this.chunkSize);
        this.audioBuffer = this.audioBuffer.slice(this.chunkSize);
        this.sendChunkToTelecmi(chunk);
      } else if (!this.isStreaming) {
        // Send silence or stop if no more data and streaming ended
        const silenceChunk = Buffer.alloc(this.chunkSize, 0);
        this.sendChunkToTelecmi(silenceChunk);
      }
    }, config.audio.chunkDurationMs);
  }

  sendChunkToTelecmi(chunk) {
    // Simulate sending chunk to TeleCMI
    logger.info(
      `[DEMO] Sending ${
        chunk.length
      } bytes to TeleCMI at ${new Date().toISOString()}`
    );
    // In a real implementation, this would send via WebSocket
  }
}

module.exports = AudioScheduler;
