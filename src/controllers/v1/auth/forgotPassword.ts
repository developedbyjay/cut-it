import type { NextFunction, Request, Response } from "express";
import { PasswordResetRequestBody } from "@/utils/types";
import { User } from "@/models/user";
import { AppError, catchAsync } from "@/lib/appError";
import { generatePasswordResetTokenAndSaveInRedis } from "@/lib/jwt";

const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body as PasswordResetRequestBody;

    const user = await User.findOne({ email }).select("name").exec();

    if (!user) return next(new AppError("Email not found", 404));

    const encryptedToken = await generatePasswordResetTokenAndSaveInRedis({
      email,
    });

    res.status(200).json({
      status: "success",
      message: "Password reset link sent to email",
      data: {
        email,
        token: encryptedToken,
      },
    });
  }
);

export { forgotPassword };
