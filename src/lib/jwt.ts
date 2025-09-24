import jwt from "jsonwebtoken";
import { Types } from "mongoose";

import { Response } from "express";
import { encryptData } from "./encryption";
import { setCache, deleteCache, getCache } from "@/redis";
import {
  generateRedisUserKey,
  generateRedisTokenKey,
  generateTTL,
} from "@/utils";
import { ResetLinkPayload, TokenPayload } from "@/utils/types";
import { logger } from "./winston";

export const generatePasswordResetTokenAndSaveInRedis = async (
  payload: ResetLinkPayload
): Promise<string> => {
  const token = jwt.sign(
    payload,
    process.env.JWT_PASSWORD_RESET_SECRET as string,
    {
      expiresIn: "15min",
    }
  );

  const encryptedToken = encryptData(token);

  const { exp, email } = jwt.decode(token, { json: true }) as {
    exp: number;
    email: string;
  };

  const cachedToken = await getCache(generateRedisTokenKey(email));
  logger.info(`Cached token: ${cachedToken}`);
  if (cachedToken !== null) await deleteCache(generateRedisTokenKey(email));

  await setCache(
    generateRedisTokenKey(email),
    encryptedToken,
    generateTTL(exp)
  );

  return encryptedToken;
};

export const generateAccessToken = (payload: TokenPayload): string => {
  const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: "1hr",
    subject: "accessToken",
  });
  return token;
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "7days",
    subject: "refreshToken",
  });
  return token;
};

export const generateTokens = async (
  userId: Types.ObjectId,
  res: Response
): Promise<{ accessToken: string; refreshToken: string }> => {
  const accessToken = generateAccessToken({ userId });
  const refreshToken = generateRefreshToken({ userId });

  const encryptedRefreshToken = encryptData(refreshToken);

  const cachedToken = await getCache(generateRedisUserKey(userId.toString()));
  if (cachedToken !== null)
    await deleteCache(generateRedisUserKey(userId.toString()));

  const decoded = jwt.decode(refreshToken, { json: true }) as {
    exp: number;
    userId: Types.ObjectId;
  };

  await setCache(
    generateRedisUserKey(userId.toString()),
    encryptedRefreshToken,
    generateTTL(decoded.exp)
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.cookie("refreshToken", encryptedRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
};

export const verifyPasswordResetToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_PASSWORD_RESET_SECRET as string);
};
