import { validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "@/lib/appError";

const validationError = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new AppError(
        `Validation Error: ${errors
          .array()
          .map((err) => err.msg)
          .join(", ")}`,
        400
      )
    );
  }
  next();
};

export { validationError };
