import { type Request, type Response } from "express";
import { UserService } from "../services/user.service.js";

const get = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    return await UserService.get(req, res);
};

const update = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    return await UserService.update(req, res);
};

const getMembers = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    return await UserService.getMembers(res);
};

const switchLikeStatus = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    return await UserService.switchLikeStatus(req, res);
};

export const UserController = {
    get,
    update,
    getMembers,
    switchLikeStatus
};
