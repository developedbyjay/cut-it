import { NextFunction, Request, Response } from "express";
import { Link } from "@/models/link";
import { User } from "@/models/user";

import { AppError, catchAsync } from "@/lib/appError";
import { logger } from "@/lib/winston";

export const redirect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { backHalf } = req.params;

    const linkExists = await Link.exists({ backHalf }).exec();

    if (!linkExists) {
      return next(new AppError("Link not found checks", 404));
    }

    const link = await Link.findOne({ backHalf })
      .select("creator destination totalVisitCount")
      .exec();

    if (!link) {
      return next(new AppError("Link not found", 404));
    }

    link.totalVisitCount += 1;

    await link.save();

    const userExists = await User.exists({ _id: link.creator }).exec();

    if (!userExists) {
      return next(new AppError("Creator not found", 404));
    }

    await User.findByIdAndUpdate(link.creator, {
      $inc: { totalVisitCount: 1 },
    });

    // Normalize the destination URL
    let normalizedUrl = link.destination;

    logger.info(`Normalized URL before protocol check: ${normalizedUrl}`);
    // If URL doesn't have a protocol, add https://
    if (!normalizedUrl.match(/^https?:\/\//)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    logger.info(`Final normalized URL: ${normalizedUrl}`);

    // Validate the URL format
    try {
      new URL(normalizedUrl);
    } catch (error) {
      return next(new AppError("Invalid destination URL", 400));
    }

    res.redirect(normalizedUrl);
  }
);
