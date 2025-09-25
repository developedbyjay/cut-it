import { body } from "express-validator";
import { Router } from "express";
import { authenticate } from "@/middleware/authentication";
import { authorization } from "@/middleware/authorization";
import { User } from "@/models/user";
import { logger } from "@/lib/winston";
import { validationError } from "@/middleware/validate";
import { getRateLimit } from "@/lib/ratelimit";
import { getCurrentUser } from "@/controllers/v1/user/getCurrentUser";
import { deleteCurrentUser } from "@/controllers/v1/user/deleteCurrentUser";
import { updateCurrentUser } from "@/controllers/v1/user/updateCurrentUser";

const router = Router();

router.get(
  "/current",
  getRateLimit("basic"),
  authenticate,
  authorization(["user", "admin"]),
  getCurrentUser
);

router.delete(
  "/current",
  getRateLimit("basic"),
  authenticate,
  authorization(["user", "admin"]),
  deleteCurrentUser
);

router.patch(
  "/current",
  getRateLimit("basic"),
  authenticate,
  authorization(["user", "admin"]),
  body("name").optional().isString().trim().isLength({ min: 2, max: 100 }),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email")
    .custom(async (email) => {
      const duplicateEmail = await User.exists({ email }).exec();
      if (duplicateEmail) {
        throw new Error("Email already in use");
      }
    }),
  body("currentPassword")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .custom(async (currentPassword, { req }) => {
      const userId = req.userId;
      const user = await User.findById(userId).select("+password").exec();
      if (!user) throw new Error("User not found");
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) throw new Error("Current password is incorrect");
    }),
  body("newPassword")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .custom(async (newPassword, { req }) => {
      const userId = req.userId;
      const user = await User.findById(userId).select("+password").exec();
      const isMatch = await user!.comparePassword(newPassword);
      if (isMatch) throw new Error("Kindly choose a different password");
    }),
  body("role").not().exists().withMessage("Role cannot be changed"),
  validationError,
  updateCurrentUser
);

export default router;
