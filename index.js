const AudioScheduler = require("./scheduler");
const logger = require("./logger");

async function main() {
  const text =
    process.argv[2] ||
    "Hello, this is a test message for the voice AI calling chatbot platform.";
  const scheduler = new AudioScheduler();

  process.on("SIGINT", () => {
    logger.info("Received SIGINT, stopping scheduler...");
    scheduler.stop();
    process.exit(0);
  });

  try {
    await scheduler.start(text);
    // Keep the process running until manually stopped
    setInterval(() => {}, 1000);
  } catch (error) {
    logger.error("Application error", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { AudioScheduler };
