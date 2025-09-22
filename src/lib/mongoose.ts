import mongoose from "mongoose";
import { logger } from "@/lib/winston";

import type { ConnectOptions } from "mongoose";

const clientOptions: ConnectOptions = {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
  dbName: "cut-it",
};

export const connectToDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable is not defined");
    }
    await mongoose.connect(mongoUri, clientOptions);
    logger.info("MongoDB connected");
  } catch (error) {
    logger.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info("MongoDB disconnected", {
      timeStamp: new Date().toISOString(),
      URI: process.env.MONGO_URI || "MONGO_URI not defined",
      options: clientOptions,
    });
  } catch (error) {
    logger.error("Error disconnecting from MongoDB:", error);
  }
};
