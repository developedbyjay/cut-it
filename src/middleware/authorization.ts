import type { Request, Response, NextFunction } from "express";
import { logger } from "@/lib/winston";
import { User } from "@/models/user";
import { Role } from "@/utils/types";
import { AppError } from "@/lib/appError";

const authorization = (role: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    if (!userId) {
      return next(
        new AppError("Unauthorized, Please Login to your account", 401)
      );
    }
    const user = await User.findById(userId).select("+role").lean().exec();
    if (!user || !role.includes(user.role)) {
      return next(
        new AppError("Forbidden, you can not perform this operation", 403)
      );
    }

    next();
  };
};

export { authorization };
