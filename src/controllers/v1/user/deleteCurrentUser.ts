import { User } from "@/models/user";
import type { Request, Response, NextFunction } from "express";

import { catchAsync } from "@/lib/appError";

const deleteCurrentUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    await User.findByIdAndDelete(userId).exec();

    res.status(204).json({
      status: "success",
      message: "User deleted successfully",
    });
  }
);

export { deleteCurrentUser };