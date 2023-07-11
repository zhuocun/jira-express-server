import express from "express";
import auth from "../middleware/auth.middleware.js";
import { TaskController } from "../controllers/task.controller.js";
import { Validator } from "../utils/validation.util.js";

const taskRouter = express.Router();
taskRouter
    .get("/", auth, TaskController.get) // NOSONAR
    .post("/", auth, Validator.createTask, TaskController.create) // NOSONAR
    .put("/", auth, TaskController.update) // NOSONAR
    .delete("/", auth, TaskController.remove) // NOSONAR
    .put("/orders", TaskController.reorder); // NOSONAR

export default taskRouter;
