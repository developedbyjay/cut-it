import { AppError, catchAsync } from "@/lib/appError";
import { Link } from "@/models/link";
import { LinkRequestBody } from "@/utils/types";
import { NextFunction, Request, Response } from "express";

export const updateLinkById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const { linkId } = req.params;
    const { title, destination, backHalf } = req.body as LinkRequestBody;

    const link = await Link.findOne({ _id: linkId, creator: userId }).exec();

    if (!link) {
      return next(new AppError("Link not found / not yours", 404));
    }

    if (title) link.title = title;
    if (destination) link.destination = destination;
    if (backHalf) link.backHalf = backHalf;
    
    await link.save();

    res.status(200).json({
      status: "success",
      message: "Link updated successfully",
      data: link,
    });
  }
);
