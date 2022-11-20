import { Request, Response } from "express";
import { UserService } from "../services/user.service.js";

const update = async (req: Request, res: Response) => {
    return await UserService.update(req, res);
};

export const UserController = {
    update
};
