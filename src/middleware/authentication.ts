import { AppError, catchAsync } from "@/lib/appError";
import type { Request, Response, NextFunction } from "express";
import { TokenPayload } from "@/utils/types";
import { verifyAccessToken } from "@/lib/jwt";

const authenticate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next(new AppError("Access Token missing", 401));
    }

    const token = authorization!.split(" ")[1];
    const decoded = verifyAccessToken(token) as TokenPayload;

    if (!decoded || !decoded.userId) {
      return next(new AppError("Invalid Access Token", 401));
    }

    req.userId = decoded.userId;
    next();
  }
);

export { authenticate };
