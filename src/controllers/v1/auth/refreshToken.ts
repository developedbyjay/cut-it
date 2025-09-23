import { AppError, catchAsync } from "@/lib/appError";
import { decryptData } from "@/lib/encryption";
import { generateAccessToken, verifyRefreshToken } from "@/lib/jwt";
import { deleteCache, getCache } from "@/redis";
import { generateRedisUserKey, generateTTL } from "@/utils";
import type { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";

const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { refreshToken } = req.cookies as { refreshToken: string }; // encrypted RT

    const decryptedRefreshToken = decryptData(refreshToken); // normal RT

    const { userId, exp } = verifyRefreshToken(decryptedRefreshToken) as {
      exp: number;
      userId: Types.ObjectId;
    };

    const cachedToken = await getCache(generateRedisUserKey(userId.toString()));

    if (cachedToken === null || cachedToken !== refreshToken) {
      return next(
        new AppError("AuthenticationError, Invalid Refresh Token", 401)
      );
    }

    const ttl = generateTTL(exp);

    if (ttl <= 0) {
      await deleteCache(generateRedisUserKey(userId.toString()));
      return next(
        new AppError("AuthenticationError, Refresh Token Expired", 401)
      );
    }

    const accessToken = generateAccessToken({ userId });

    res.status(200).json({
      message: "Access Token Generated Successfully",
      accessToken,
    });
  }
);

export { refreshToken };
