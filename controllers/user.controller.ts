import { type Request, type Response } from "express";
import { UserService } from "../services/user.service.js";
import { getUserId } from "../utils/user.util.js";
import { StatusCodes } from "http-status-codes";
import handleError from "../utils/error.util.js";

const get = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    try {
        const userId = getUserId(req);
        if (userId != null) {
            const user = await UserService.get(userId);
            if (user != null) {
                return res.status(StatusCodes.OK).json(user);
            } else {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ error: "User not found" });
            }
        } else {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ error: "Lack of user information" });
        }
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: handleError(error, "Error getting user").message });
    }
};

const update = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    try {
        const userId = getUserId(req);
        const updateData = req.body;
        if (userId != null && updateData != null) {
            const result = await UserService.update(userId, updateData);
            if (result === "User not found") {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ error: result });
            } else {
                return res.status(StatusCodes.OK).json({ userInfo: result });
            }
        } else {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ error: "Lack of information" });
        }
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: handleError(error, "Error updating user").message });
    }
};

const getMembers = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    try {
        const members = await UserService.getMembers();
        if (members != null) {
            return res.status(StatusCodes.OK).json(members);
        } else {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ error: "Members not found" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: handleError(error, "Error getting members").message
        });
    }
};

const switchLikeStatus = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    try {
        const userId = getUserId(req);
        const projectId = req.body.projectId;
        if (userId != null && projectId != null) {
            const result = await UserService.switchLikeStatus(
                userId,
                projectId
            );
            if (result != null && typeof result !== "string") {
                return res.status(StatusCodes.OK).json({
                    username: result.username,
                    likedProjects: result.likedProjects
                });
            } else {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ error: result });
            }
        } else {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ error: "Lack of information" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: handleError(error, "Error switching like status").message
        });
    }
};

export const UserController = {
    get,
    update,
    getMembers,
    switchLikeStatus
};
