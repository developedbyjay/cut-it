import type { CorsOptions } from "cors";

const corsOption: CorsOptions = {
  origin(origin, callback) {
    if (
      process.env.NODE_ENV === "development" ||
      (origin && process.env.WHITELIST_ORIGINS &&
        process.env.WHITELIST_ORIGINS.includes(origin))
    ) {
      callback(null, true);
    } else {
      callback(
        new Error(`CORS Error: ${origin} is not allowed by cors`),
        false
      );
    }
  },
  credentials: true,
};

export { corsOption };
