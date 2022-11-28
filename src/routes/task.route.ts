import express from "express";
import auth from "../middlewares/auth.middleware.js";
import { TaskController } from "../controllers/task.controller.js";
import { Validator } from "../utils/validation.util.js";

const taskRouter = express.Router();
taskRouter.post("/", auth, Validator.createTask, TaskController.create);

export default taskRouter;
