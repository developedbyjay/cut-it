import type { NextFunction, Request, Response } from "express";
import { PasswordResetRequestBody } from "@/utils/types";
import { User } from "@/models/user";
import { AppError, catchAsync } from "@/lib/appError";
import { generatePasswordResetTokenAndSaveInRedis } from "@/lib/jwt";
import { transporter } from "@/lib/nodemailer";
import { resetLinkTemplate } from "@/mailTemplates/resetLink";

const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body as PasswordResetRequestBody;

    const user = await User.findOne({ email }).select("name").exec();

    if (!user) return next(new AppError("Email not found", 404));

    const encryptedToken = await generatePasswordResetTokenAndSaveInRedis({
      email,
    });

    await transporter.sendMail({
      from: '"Cut-It" <no-reply@cut-it.com>',
      to: email,
      subject: "Password Reset",
      html: resetLinkTemplate({
        name: user.name,
        resetLink: `${
          process.env.FRONTEND_URL
        }/reset-password?token=${encodeURIComponent(encryptedToken)}`,
        companyName: "Cut-It",
        currentYear: new Date().getFullYear(),
      }),
    });

    res.status(200).json({
      status: "success",
      message: "Password reset link sent to email",
      data: {
        email,
      },
    });
  }
);

export { forgotPassword };
