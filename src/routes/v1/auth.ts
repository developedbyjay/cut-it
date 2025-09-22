import { Router } from "express";
import { body } from "express-validator";
import { register } from "@/controllers/v1/auth/register";
import { validationError } from "@/middleware/validate";
import { getRateLimit } from "@/lib/ratelimit";

const router = Router();

router.post(
  "/register",
  getRateLimit("auth"),
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail()
    .custom(async (email) => {
      // Add custom email validation logic here if needed
      return true;
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["user", "admin"])
    .withMessage("Role type is not valid"),
  validationError,
  register
);

export default router;
