const AudioScheduler = require("./scheduler");
const logger = require("./logger");

async function demo() {
  const sampleTexts = [
    "Hello, welcome to our voice AI calling chatbot platform.",
    "This is a demonstration of real-time audio scheduling.",
    "We bridge Cartesia TTS with TeleCMI telephony system.",
    "Audio chunks are repackaged into fixed 60ms intervals.",
    "Thank you for listening to this demo.",
  ];

  for (const text of sampleTexts) {
    logger.info(`Starting demo with text: "${text}"`);
    const scheduler = new AudioScheduler();

    try {
      await scheduler.start(text);
      // Wait for streaming to complete (simulate)
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Adjust based on text length
      scheduler.stop();
      logger.info("Demo segment completed");
    } catch (error) {
      logger.error("Demo error", error);
      scheduler.stop();
    }

    // Pause between segments
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  logger.info("Demo completed");
}

if (require.main === module) {
  demo();
}
