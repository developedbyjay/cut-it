import { getRateLimit } from "@/lib/ratelimit";
import { redirect } from "@/controllers/v1/redirect/redirect";
import { Router } from "express";

const router = Router();

router.get("/:backHalf", getRateLimit("basic"), redirect);

export default router;
