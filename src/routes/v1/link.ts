import { Router } from "express";
import { body, param, query } from "express-validator";
import { getRateLimit } from "@/lib/ratelimit";
import { authenticate } from "@/middleware/authentication";
import { validationError } from "@/middleware/validate";
import { authorization } from "@/middleware/authorization";
import { createLink } from "@/controllers/v1/links/createLink";
import { getMyLinks } from "@/controllers/v1/links/getMyLinks";
import { Link } from "@/models/link";
import { updateLinkById } from "@/controllers/v1/links/updateLinkById";
import { deleteLinkById } from "@/controllers/v1/links/deleteLinkById";

const router = Router();

router.post(
  "/generate",
  getRateLimit("basic"),
  authenticate,
  authorization(["user", "admin"]),
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 }),
  body("destination")
    .notEmpty()
    .withMessage("Destination URL is required")
    .isURL()
    .withMessage("Please provide a valid URL")
    .isLength({ max: 2048 }),
  body("backHalf")
    .optional()
    .trim()
    .custom(async (backHalf, { req }) => {
      const backHalfExists = await Link.exists({ backHalf }).exec();
      if (backHalfExists) {
        throw new Error(" This backHalf is already in use");
      }
    }),
  validationError,
  createLink
);

router.get(
  "/my-links",
  getRateLimit("basic"),
  authenticate,
  authorization(["user", "admin"]),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 to 100"),
  query("offset")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Offset must be a positive number"),
  getMyLinks
);

router.patch(
  "/:linkId",
  getRateLimit("basic"),
  authenticate,
  authorization(["user", "admin"]),
  param("linkId").isMongoId().withMessage("Invalid link Id"),
  body("title").optional().isString().trim().isLength({ min: 1, max: 100 }),
  body("destination")
    .optional()
    .isURL()
    .withMessage("Destination must be in url format"),
  body("backHalf")
    .optional()
    .trim()
    .custom(async (backHalf, { req }) => {
      const backHalfExists = await Link.exists({ backHalf }).exec();
      if (backHalfExists) {
        throw new Error(" This backHalf is already in use");
      }
    }),
  validationError,
  updateLinkById
);

router.delete(
  "/:linkId",
  getRateLimit("basic"),
  authenticate,
  authorization(["user", "admin"]),
  param("linkId").isMongoId().withMessage("Invalid link Id"),
  validationError,
  deleteLinkById
);
export default router;
