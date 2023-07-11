import express from "express";
import { Validator } from "../utils/validation.util.js";
import auth from "../middleware/auth.middleware.js";
import { UserController } from "../controllers/user.controller.js";

const userRouter = express.Router();
userRouter
    .put("/", auth, Validator.updateUser, UserController.update) // NOSONAR
    .get("/", auth, UserController.get) // NOSONAR
    .get("/members", auth, UserController.getMembers) // NOSONAR
    .put("/likes", auth, UserController.switchLikeStatus); // NOSONAR

export default userRouter;
