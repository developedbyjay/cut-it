import type { NextFunction, Request, Response } from "express";
import { UserRequestBody } from "@/utils/types";
import { User } from "@/models/user";
import { AppError, catchAsync } from "@/utils/appError";
import { generateTokens } from "@/lib/jwt";

const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, email, password, role } = req.body as UserRequestBody;
    if (role === "admin" && !process.env.WHITELIST_EMAILS?.includes(email)) {
      return next(
        new AppError("You are not allowed to register as admin", 400)
      );
    }
    const user = await User.create({ name, email, password, role });
    const { accessToken } = await generateTokens(user._id, res);

    res.status(201).json({
      status: "success",
      data: { user },
      accessToken,
    });
  }
);

export { register };
