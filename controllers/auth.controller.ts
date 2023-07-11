import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "../services/auth.service.js";
import handleError from "../utils/error.util.js";

const register = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    try {
        const result = await AuthService.register(req.body);
        return res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: handleError(error, "Registration failed").message });
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
            .json({ error: handleError(error, "Login failed").message });
    }
};

export const AuthController = { register, login };
