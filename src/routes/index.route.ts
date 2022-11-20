import express from "express";
import userRouter from "./user.route.js";
import authRouter from "./auth.route.js";

const router = express.Router();
router.use("/auth", authRouter).use("/users", userRouter);

export default router;
