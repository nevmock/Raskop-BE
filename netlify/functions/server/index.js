import ExpressApplication from "../../../src/app.js";
import logger from "../../../src/utils/logger.js";
import serverless from "serverless-http";

const PORT = process.env.PORT || 3000;

if (process.env.IS_NETLIFY !== "true") {
  const app = new ExpressApplication(PORT);
  const server = app.start();

  process.on("SIGTERM", () => {
    logger.warn("SIGTERM RECEIVED!");
    server.close(() => {
      logger.warn("Process Terminated!");
    });
  });
}

const app = new ExpressApplication(PORT).app;
export const handler = serverless(app);
