import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

const register = async (req: Request, res: Response) => {
    return await AuthService.register(req.body, res);
};

const login = async (req: Request, res: Response) => {
    return await AuthService.login(req.body, res);
};

export const AuthController = { register, login };
