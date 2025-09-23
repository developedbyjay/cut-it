import { User } from "@/models/user";
import type { Request, Response, NextFunction } from "express";
import { generateTokens } from "@/lib/jwt";
import { catchAsync } from "@/utils/appError";
import { UserLoginRequestBody } from "@/utils/types";

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email } = req.body as UserLoginRequestBody;

    const user = await User.findOne({ email }).select("").exec();
  }
);
export { login };
