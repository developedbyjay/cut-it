import { redisClient } from "./connection";
import { logger } from "@/lib/winston";

export const setCache = async (key: string, data: string, EX: number) => {
  try {
    redisClient.set(key, data, {
      EX,
    });
    logger.info(`Redis: Set-Cache`, key, "Value: ", data);
  } catch (error) {
    logger.error("Error while setting redis data", error);
    return null;
  }
};

export const getCache = async (key: string) => {
  try {
    const data = await redisClient.get(key);
    logger.info(`Redis: Get-Cache`, key, "Value: ", data);
    return data;
  } catch (error) {
    logger.error("Error while getting redis data", error);
    return null;
  }
};

export const deleteCache = async (key: string) => {
  try {
    const result = await redisClient.del(key);
    logger.info(`Redis: Delete-Cache`, key, "Result: ", result);
    return result;
  } catch (error) {
    logger.error("Error while deleting redis data", error);
    return null;
  }
};
