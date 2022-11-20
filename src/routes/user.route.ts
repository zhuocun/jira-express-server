import express from "express";
import { Validation } from "../utils/validation.util.js";
import auth from "../middlewares/auth.middleware.js";
import { UserController } from "../controllers/user.controller.js";

const userRouter = express.Router();
userRouter.put("/", auth, Validation.update, UserController.update);

export default userRouter;
