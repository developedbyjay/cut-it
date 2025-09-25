import type { Request, Response, NextFunction } from "express";
import { User } from "@/models/user";
import { catchAsync } from "@/lib/appError";
import { UserUpdateBody } from "@/utils/types";

const updateCurrentUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const updates = req.body as UserUpdateBody;

    if (updates.newPassword) {
      // Hash the new password before saving
      const user = await User.findById(userId).select("+password").exec();
      user!.password = updates.newPassword;
      await user!.save();
      delete updates.newPassword; // Remove password from updates to avoid overwriting
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).exec();

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: { user: updatedUser },
    });
  }
);

export { updateCurrentUser };
