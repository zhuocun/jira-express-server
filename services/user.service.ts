import { StatusCodes } from "http-status-codes";
import { type Request, type Response } from "express";
import { getUserId, mapUser } from "../utils/user.util.js";
import findById from "../utils/database/CRUD/findById.js";
import ETableName from "../constants/eTableName.js";
import IUser from "../interfaces/user.js";
import findByIdAndUpdate from "../utils/database/CRUD/findByIdAndUpdate.js";
import find from "../utils/database/CRUD/find.js";
import IProject from "../interfaces/project.js";

const get = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const userId = getUserId(req);
    if (userId != null) {
        const user = await findById<IUser>(userId, ETableName.USER);
        if (user != null) {
            return res.status(StatusCodes.OK).json({
                _id: user._id,
                username: user.username,
                likedProjects: user.likedProjects,
                email: user.email
            });
        } else {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ error: "User not found" });
        }
    }
    return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
};

const update = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const userId = getUserId(req);
    if (userId != null) {
        const user = await findById<IUser>(userId, ETableName.USER);
        if (user != null) {
            const updateRes = await findByIdAndUpdate(
                userId,
                req.body,
                ETableName.USER,
                {
                    new: true
                }
            );
            return res.status(StatusCodes.OK).json({ userInfo: updateRes });
        }
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: "User not found" });
    } else {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: "Bad request" });
    }
};

const getMembers = async (
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const members = await find<IUser>({}, ETableName.USER);
    if (members != null) {
        return res.status(StatusCodes.OK).json(members);
    } else return res.status(StatusCodes.NOT_FOUND).json("Members not found");
};

const switchLikeStatus = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const userId = getUserId(req);
    if (userId != null) {
        const user =
            userId != null
                ? await findById<IUser>(userId, ETableName.USER)
                : null;
        if (user == null) {
            return res.status(StatusCodes.NOT_FOUND).json("User not found");
        }
        const projectId = req.body.projectId;
        const project = await findById<IProject>(projectId, ETableName.PROJECT);
        if (project == null) {
            return res.status(StatusCodes.NOT_FOUND).json("Project not found");
        }
        if (user.likedProjects == null) {
            user.likedProjects = [];
        }
        let likedProjects =
            user.likedProjects.length > 0 ? user.likedProjects : [];
        likedProjects.includes(projectId)
            ? likedProjects.splice(likedProjects.indexOf(projectId), 1)
            : (likedProjects = likedProjects.concat(projectId));
        const updatedData = {
            ...mapUser(user),
            likedProjects
        };
        const updatedUser = await findByIdAndUpdate<IUser>(
            userId,
            updatedData,
            ETableName.USER,
            {
                new: true
            }
        );
        if (updatedUser != null) {
            return res.status(StatusCodes.OK).json({
                username: updatedUser.username,
                likedProjects: updatedUser.likedProjects
            });
        } else return res.status(StatusCodes.NOT_FOUND).json("User not found");
    } else return res.status(StatusCodes.BAD_REQUEST).json("Bad request");
};

export const UserService = { get, update, getMembers, switchLikeStatus };
