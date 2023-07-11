import express from "express";
import auth from "../middleware/auth.middleware.js";
import { ProjectController } from "../controllers/project.controller.js";
import { Validator } from "../utils/validation.util.js";

const projectRouter = express.Router();
projectRouter
    .post("/", auth, Validator.createProject, ProjectController.create) // NOSONAR
    .get("/", auth, ProjectController.get) // NOSONAR
    .put("/", auth, ProjectController.update) // NOSONAR
    .delete("/", auth, ProjectController.remove); // NOSONAR

export default projectRouter;
