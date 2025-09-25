import { AppError, catchAsync } from "@/lib/appError";
import type { Request, Response, NextFunction } from "express";
import { User } from "@/models/user";
import { getPasswordResetTokenFromRedisAndVerify } from "@/lib/jwt";

import { transporter } from "@/lib/nodemailer";
import { RequestQuery, RequestBody } from "@/utils/types";
import { passResetInfoTemplate } from "@/Templates/passwordResetInfo";
import { generateRedisTokenKey } from "@/utils";
import { deleteCache } from "@/redis";

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.query as RequestQuery;
    const { password } = req.body as RequestBody;

    const { email } = await getPasswordResetTokenFromRedisAndVerify(token);

    if (!email) {
      return next(new AppError("Invalid or expired password reset token", 401));
    }

    const user = await User.findOne({ email }).select("password name").exec();

    if (!user)
      return next(new AppError("User with the email is not available", 404));

    if (await user.comparePassword(password)) {
      return next(
        new AppError(
          "New password must be different from the old password",
          403
        )
      );
    }

    user.password = password;
    await user.save();

    await transporter.sendMail({
      from: '"Cut-It" <noreply@cut-it.com>',
      to: email,
      subject: "Password Reset Successfully",
      html: passResetInfoTemplate({
        name: user.name,
        companyName: "Cut-It",
        currentYear: new Date().getFullYear(),
      }),
    });

    await deleteCache(generateRedisTokenKey(email));

    res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  }
);

export { resetPassword };
