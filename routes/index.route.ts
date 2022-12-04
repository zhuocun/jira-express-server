import express from "express";
import userRouter from "./user.route.js";
import authRouter from "./auth.route.js";
import projectRouter from "./project.route.js";
import columnRouter from "./board.route.js";
import taskRouter from "./task.route.js";

const router = express.Router();
router
    .use("/auth", authRouter)
    .use("/users", userRouter)
    .use("/projects", projectRouter)
    .use("/boards", columnRouter)
    .use("/tasks", taskRouter);

export default router;
