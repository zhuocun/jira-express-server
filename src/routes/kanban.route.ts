import express from "express";
import auth from "../middlewares/auth.middleware.js";
import { KanbanController } from "../controllers/kanban.controller.js";
import { Validator } from "../utils/validation.util.js";

const kanbanRouter = express.Router();
kanbanRouter
    .get("/", auth, KanbanController.get)
    .post("/", auth, Validator.createKanban, KanbanController.create)
    .put("/orders", auth, KanbanController.reorder);

export default kanbanRouter;
