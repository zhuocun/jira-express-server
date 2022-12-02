import express from "express";
import auth from "../middlewares/auth.middleware.js";
import { ProjectController } from "../controllers/project.controller.js";
import { Validator } from "../utils/validation.util.js";

const projectRouter = express.Router();
projectRouter
    .post("/", auth, Validator.createProject, ProjectController.create)
    .get("/", auth, ProjectController.get)
    .put("/", auth, ProjectController.update)
    .delete("/", auth, ProjectController.remove);

export default projectRouter;
