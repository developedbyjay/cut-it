import winston from "winston";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";

const transports: winston.transport[] = [];

if (!process.env.LOGTAIL_INGESTING_HOST || !process.env.LOGTAIL_SOURCE_TOKEN) {
  throw new Error("Logtail configs are missing");
}

const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN, {
  endpoint: process.env.LOGTAIL_INGESTING_HOST,
});

if (process.env.NODE_ENV === "production")
  transports.push(new LogtailTransport(logtail));

const { combine, timestamp, json, errors, align, printf, colorize } =
  winston.format;

if (process.env.NODE_ENV !== "production") {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: "YYYY-MM-DD hh:mm:ss A" }),
        align(),
        printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length
            ? `\n${JSON.stringify(meta)}`
            : "";
          return `${timestamp} [${level}]: ${message}${metaStr}`;
        })
      ),
    })
  );
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports,
  silent: process.env.NODE_ENV === "production" && transports.length === 0,
});

export { logger };
