import { logger } from "@/lib/winston";
import type { Request, Response, NextFunction } from "express";
import { User } from "@/models/user";
import { catchAsync } from "@/lib/appError";

const getCurrentUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const user = await User.findById(userId).select("-__v").lean().exec();

    res.status(200).json({
      status: "success",
      data: { user },
    });
  }
);

export { getCurrentUser };
