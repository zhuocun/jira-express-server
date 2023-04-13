import { type Request, type Response } from "express";
import { UserService } from "../services/user.service.js";
import { getUserId } from "../utils/user.util.js";
import { StatusCodes } from "http-status-codes";

const get = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const userId = getUserId(req);
    if (userId != null) {
        const user = await UserService.get(userId);
        if (user != null) {
            return res.status(StatusCodes.OK).json({ userInfo: user });
        }
    }
    return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
};

const update = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const userId = getUserId(req);
    const updateData = req.body;

    if (userId != null && updateData != null) {
        const updatedUser = await UserService.update(userId, updateData);

        if (updatedUser != null) {
            return res.status(StatusCodes.OK).json({ userInfo: updatedUser });
        } else {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ error: "User not found" });
        }
    } else {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: "Bad request" });
    }
};

const getMembers = async (
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const members = await UserService.getMembers();

    if (members != null) {
        return res.status(StatusCodes.OK).json(members);
    } else {
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: "Members not found" });
    }
};

const switchLikeStatus = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const userId = getUserId(req);
    const projectId = req.body.projectId;

    if (userId != null && projectId != null) {
        const updatedUser = await UserService.switchLikeStatus(
            userId,
            projectId
        );

        if (updatedUser != null) {
            return res.status(StatusCodes.OK).json({
                username: updatedUser.username,
                likedProjects: updatedUser.likedProjects
            });
        } else {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ error: "User or Project not found" });
        }
    } else {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: "Bad request" });
    }
};

export const UserController = {
    get,
    update,
    getMembers,
    switchLikeStatus
};
