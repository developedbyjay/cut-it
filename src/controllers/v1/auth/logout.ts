import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "@/lib/appError";
import { deleteCache, getCache } from "@/redis";
import { generateRedisKey } from "@/utils";

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.userId;

    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    const cachedToken = await getCache(generateRedisKey(userId!.toString()));

    if (cachedToken !== null)
      await deleteCache(generateRedisKey(userId!.toString()));

    res.status(204).send();
  }
);
export { logout };
