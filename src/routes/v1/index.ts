import { Router } from "express";
import authRoute from "@/routes/v1/auth";
import userRoute from "@/routes/v1/user";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "API is live",
    status: "ok",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    // docs
  });
});

router.use("/auth", authRoute);
router.use("/users", userRoute);

export { router };
