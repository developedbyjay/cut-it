import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import { router as v1Router } from "@/routes";
import { corsOption } from "@/lib/cors";

const app = express();
const port = process.env.PORT || 8080;

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOption));
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());
app.use(compression());

(async function (): Promise<void> {
  try {
    app.use("/v1", v1Router);
    app.listen(port, () => {
      console.log(`App listening on port ${port} at http://localhost:${port}`);
    });
  } catch (err) {
    console.error(`Failed to start server`, err);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
})();

const serverTermination = async (signal: NodeJS.Signals): Promise<void> => {
  try {
    console.log("server shutdown", signal);
    process.exit(0);
  } catch (error) {
    console.error("Error shutting down server", error);
  }
};

process.on("SIGINT", serverTermination); // Handle Ctrl+C
process.on("SIGTERM", serverTermination); // Handle termination signals
