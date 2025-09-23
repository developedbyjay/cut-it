import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { logger } from "./winston";
import { Response } from "express";
import { encryptData } from "./encryption";
import { setCache, deleteCache } from "@/redis";
import { generateRedisKey, generateTTL } from "@/utils";
import { TokenPayload } from "@/utils/types";

export const generateAccessToken = (payload: TokenPayload): string => {
  const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: "1hr",
    subject: "accessToken",
  });
  return token;
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "7d",
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

  // Delete the existing refresh token from Redis if any
  await deleteCache(generateRedisKey(userId.toString()));

  const decoded = jwt.decode(refreshToken, { json: true }) as {
    exp: number;
    userId: Types.ObjectId;
  };

  await setCache(
    generateRedisKey(userId.toString()),
    encryptedRefreshToken,
    generateTTL(decoded.exp)
  );

  logger.info("Refresh Token Created", {
    userId: userId._id,
    refreshToken,
    encryptedRefreshToken,
  });

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
