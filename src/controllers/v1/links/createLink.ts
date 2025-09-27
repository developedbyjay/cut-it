import type { Request, Response } from "express";
import { Link } from "@/models/link";
import { LinkRequestBody } from "@/utils/types";
import { catchAsync } from "@/lib/appError";
import { generateBackHalf } from "@/utils";

const createLink = catchAsync(async (req: Request, res: Response) => {
  const userId = req.userId;
  const {
    title,
    destination,
    backHalf = generateBackHalf(),
  } = req.body as LinkRequestBody;

  const newLink = await Link.create({
    title,
    destination,
    backHalf,
    creator: userId,
  });
  res.status(201).json({
    status: "success",
    message: "Link created successfully",
    link: newLink,
  });
});
export { createLink };
