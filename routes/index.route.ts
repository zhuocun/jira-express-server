import express from "express";
import userRouter from "./user.route.js";
import authRouter from "./auth.route.js";
import projectRouter from "./project.route.js";
import kanbanRouter from "./kanban.route.js";
import taskRouter from "./task.route.js";

const router = express.Router();
router
    .use("/auth", authRouter)
    .use("/users", userRouter)
    .use("/projects", projectRouter)
    .use("/kanbans", kanbanRouter)
    .use("/tasks", taskRouter);

export default router;