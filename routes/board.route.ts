import express from "express";
import auth from "../middleware/auth.middleware.js";
import { BoardController } from "../controllers/board.controller.js";
import { Validator } from "../utils/validation.util.js";

const columnRouter = express.Router();
columnRouter
    .get("/", auth, BoardController.get) // NOSONAR
    .post("/", auth, Validator.createColumn, BoardController.create) // NOSONAR
    .delete("/", auth, BoardController.remove) // NOSONAR
    .put("/orders", auth, BoardController.reorder); // NOSONAR

export default columnRouter;
