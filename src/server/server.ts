import App from "./App";
import { isOperationalError, logError } from "./helpers/errorHandler";
import SharedContext from "./SharedContext";
import dotenv from "dotenv";
import { expand } from "dotenv-expand";

import "reflect-metadata";

// Load environment variables
expand(dotenv.config());

const startServer = () => {
  try {
    const PORT = process.env.API_PORT || 8080;

    // Start the server
    App.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });

    /**
     * Event listener for unhandled promise rejections.
     * Throws the error to ensure it gets logged and handled properly.
     * @param {Error} error - The unhandled rejection error.
     */
    process.on("unhandledRejection", async (error: Error) => {
      logError(error);
      await SharedContext.geoGeniusOrm.close();
      throw error;
    });

    /**
     * Handle uncaught exceptions and log errors.
     * If the error is not operational, exit the process.
     */
    process.on("uncaughtException", async (error) => {
      logError(error);

      if (!isOperationalError(error)) {
        await SharedContext.geoGeniusOrm.close();
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
