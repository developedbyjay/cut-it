import { logger } from "@/lib/winston";
import { createClient } from "redis";

let redisClient = createClient();

const initializeRedisConnection = async () => {
  try {
    redisClient.on("error", (err) => {
      logger.error("Error event Occured in Redis", err);
    });
    await redisClient.connect();
    logger.info("Reddis Successfully Connected");
  } catch (error) {
    logger.error("Redis connection error:", error);
  }
};

const redisDisconnect = async () => {
  try {
    redisClient.destroy();
    logger.info("Redis Disconnected", {
      timeStamp: new Date().toISOString(),
      URI: process.env.REDIS_URI || "REDIS_URI not defined",
    });
  } catch (error) {
    logger.error("Error disconnecting from Redis:", error);
  }
};

export { redisClient, redisDisconnect, initializeRedisConnection };

// To run a Redis server using Docker, use the following command:
// docker run --name redis -d -p 6379:6379 redis/redis-stack:latest
