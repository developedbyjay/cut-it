import { AppError, catchAsync } from "@/lib/appError";
import { Link } from "@/models/link";
import { NextFunction, Request, Response } from "express";

export const deleteLinkById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const { linkId } = req.params;

    const link = await Link.exists({ _id: linkId, creator: userId }).exec();

    if (!link) {
      return next(
        new AppError("Link not found / not yours", 404)
      );
    }

    await Link.findByIdAndDelete(linkId);

    res.status(204).json({
      status: "success",
      message: "Link deleted successfully",
    });
  }
);
