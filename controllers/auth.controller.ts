import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "../services/auth.service.js";
import handleError from "../utils/error.util.js";

const register = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const result = await AuthService.register(req.body);
    if (result != null) {
        return res.status(StatusCodes.CREATED).json(result);
    } else {
        return res
            .status(StatusCodes.CONFLICT)
            .json({ error: "Registration failed" });
    }
};

const login = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    try {
        const result = await AuthService.login(req.body);
        return res.status(StatusCodes.OK).json(result);
    } catch (error) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ error: handleError(error, "Login failed") });
    }
};

export const AuthController = { register, login };
