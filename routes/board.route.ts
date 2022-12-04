import express from "express";
import auth from "../middlewares/auth.middleware.js";
import { BoardController } from "../controllers/board.controller.js";
import { Validator } from "../utils/validation.util.js";

const columnRouter = express.Router();
columnRouter
    .get("/", auth, BoardController.get)
    .post("/", auth, Validator.createColumn, BoardController.create)
    .delete("/", auth, BoardController.remove)
    .put("/orders", auth, BoardController.reorder);

export default columnRouter;
