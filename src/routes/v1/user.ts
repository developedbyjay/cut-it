import { logger } from "@/lib/winston";
import { Router } from "express";
import { authenticate } from "@/middleware/authentication";
import { User } from "@/models/user";
import { body } from "express-validator";
import { validationError } from "@/middleware/validate";
import { getRateLimit } from "@/lib/ratelimit";
import { getCurrentUser } from "@/controllers/v1/user/getCurrentUser";
import { deleteCurrentUser } from "@/controllers/v1/user/deleteCurrentUser";
import { authorization } from "@/middleware/authorization";

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

export default router;
