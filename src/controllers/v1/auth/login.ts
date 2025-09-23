import { User } from "@/models/user";
import type { Request, Response, NextFunction } from "express";
import { generateTokens } from "@/lib/jwt";
import { catchAsync } from "@/lib/appError";
import { UserLoginRequestBody } from "@/utils/types";

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email } = req.body as UserLoginRequestBody;

    const user = await User.findOne({ email }).select("-__v").lean().exec();

    const { accessToken } = await generateTokens(user!._id, res);

    res.status(200).json({
      status: "success",
      data: { user },
      accessToken,
    });
  }
);
export { login };
