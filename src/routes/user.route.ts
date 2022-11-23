import express from "express";
import { Validator } from "../utils/validation.util.js";
import auth from "../middlewares/auth.middleware.js";
import { UserController } from "../controllers/user.controller.js";

const userRouter = express.Router();
userRouter
    .put("/", auth, Validator.updateUser, UserController.update)
    .get("/", auth, UserController.get)
    .get("/members", auth, UserController.getMembers)
    .put("/likes", auth, UserController.switchLikeStatus);

export default userRouter;
