import { catchAsync } from "@/lib/appError";
import { NextFunction, Response, Request } from "express";
import { Link } from "@/models/link";
import { LinkField, RequestQueryLinks } from "@/utils/types";
import type { SortOrder } from "mongoose";
import { generateNextLink, generatePrevLink } from "@/utils";

const getMyLinks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const {
      search = "",
      sortby = "createdAt_desc",
      offset = 0,
      limit = 100,
    } = req.query as RequestQueryLinks;
    // Reqex for search in db
    const searchRegex = new RegExp(`\\b${search}\\b`, "gi");
    // split sortby into field and order (e.g 'createdAt_desc' => ['createdAt','desc'])
    const [sortField, sortOrder] = sortby.split("_") as [LinkField, SortOrder];

    const links = await Link.find({ creator: userId })
      .where("title", searchRegex)
      .sort({ [sortField]: sortOrder })
      .skip(offset)
      .limit(limit)
      .lean()
      .exec();

    const total = await Link.countDocuments({ creator: userId })
      .where("title", searchRegex)
      .exec();

    const nextLink = total
      ? generateNextLink({
          baseUrl: req.baseUrl + req.path, // v1/links + /my-links
          search,
          sortby,
          offset: Number(offset),
          limit: Number(limit),
          total,
        })
      : null;

    const prevLink = generatePrevLink({
      baseUrl: req.baseUrl + req.path,
      search,
      sortby,
      offset: Number(offset),
      limit: Number(limit),
    });

    res.status(200).json({
      status: "success",
      message: "Documents received successfully",
      data: {
        total,
        offset: Number(offset),
        limit: Number(limit),
        next: nextLink,
        prev: prevLink,
        links,
      },
    });
  }
);

export { getMyLinks };
