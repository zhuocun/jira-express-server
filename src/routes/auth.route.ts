import express from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { Validation } from "../utils/validation.util.js";

const authRouter = express.Router();
authRouter
    .post("/register", Validation.register, AuthController.register)
    .post("/login", Validation.login, AuthController.login);

export default authRouter;
