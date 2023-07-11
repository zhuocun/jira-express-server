import express from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { Validator } from "../utils/validation.util.js";

const authRouter = express.Router();
authRouter
    .post("/register", Validator.register, AuthController.register) // NOSONAR
    .post("/login", Validator.login, AuthController.login); // NOSONAR

export default authRouter;
