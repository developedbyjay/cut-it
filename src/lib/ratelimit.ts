import { rateLimit } from "express-rate-limit";
import type { RateLimitRequestHandler, Options } from "express-rate-limit";

type RateLimitType = "basic" | "auth" | "passReset";

const defaultLimitOpt: Partial<Options> = {
  windowMs: process.env.RATE_LIMIT_WINDOW
    ? parseInt(process.env.RATE_LIMIT_WINDOW)
    : 15 * 60 * 1000,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
};

const rateLimitOpts = new Map<RateLimitType, Partial<Options>>( [
  [
    "basic",
    {
      ...defaultLimitOpt,
      max: 100, // Limit each IP to 100 requests per windowMs
    },
  ],
  [
    "auth",
    {
      ...defaultLimitOpt,
      max: 10, // Limit each IP to 10 requests per windowMs
    },
  ],
  [
    "passReset",
    {
      ...defaultLimitOpt,
      max: 5, // Limit each IP to 5 requests per windowMs
    },
  ],
]);

// function getRateLimitOptions(type: RateLimitType): Partial<Options> {
//   switch (type) {
//     case "basic":
//       return {
//         ...defaultLimitOpt,
//         max: 100, // Limit each IP to 100 requests per windowMs
//       };
//     case "auth":
//       return {
//         ...defaultLimitOpt,
//         max: 10, // Limit each IP to 10 requests per windowMs
//       };
//     case "passReset":
//       return {
//         ...defaultLimitOpt,
//         max: 5, // Limit each IP to 5 requests per windowMs
//       };
//   }
// }

const getRateLimit = (type: RateLimitType): RateLimitRequestHandler => {
  const opts = rateLimitOpts.get(type);
  if (!opts) throw new Error(`No rate limit options found for type: ${type}`);
  return rateLimit(opts);
};

export { getRateLimit, RateLimitType };
