import { Request, Response } from "express";
import { UserService } from "../services/user.service.js";

const get = async (req: Request, res: Response) => {
    return await UserService.get(req, res);
};

const update = async (req: Request, res: Response) => {
    return await UserService.update(req, res);
};

export const UserController = {
    get,
    update
};
