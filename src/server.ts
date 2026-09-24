import type { Server } from "node:http";
import { app } from "./app.js";
import { common } from "./configs/config.js";
import { connectDB, disconnectDB } from "./configs/db.js";


const PORT = common.PORT;

let server: Server | undefined;
let shuttingDown = false;

async function start(): Promise<void> {
  try {
    await connectDB();

    server = app.listen(PORT, () => {
      console.log(`Server Running on : http://localhost:${PORT}`);
    });

    server.on("error", (error) => {
      console.error("Server failed to start", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("Server failed to start", error);
    process.exit(1);
  }
}

const serverTermination = async (signal: NodeJS.Signals): Promise<void> => {
  if (shuttingDown) return;
  shuttingDown = true;

  console.info("Server shutdown", signal);

  // safety net if something hangs
  const forceExit = setTimeout(() => {
    console.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10_000);
  forceExit.unref();

  try {
    const current = server;
    if (current) {
      await new Promise<void>((resolve, reject) => {
        current.close((err) => (err ? reject(err) : resolve()));
      });
    }

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error("Error during server shutdown", error);
    process.exit(1);
  }
};

process.on("SIGTERM", serverTermination);
process.on("SIGINT", serverTermination);

start();
