import { StatusCodes } from "http-status-codes";
import { type Request, type Response } from "express";
import { getUserId, mapUser } from "../utils/user.util.js";
import findById from "../utils/databaseUtils/findById.js";
import ETableName from "../constants/eTableName.js";
import IUser from "../interfaces/user.js";
import findByIdAndUpdate from "../utils/databaseUtils/findByIdAndUpdate.js";
import find from "../utils/databaseUtils/find.js";

const get = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const userId = getUserId(req);
    if (userId != null) {
        const user = await findById(userId, ETableName.USER);
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
    const user =
        userId != null ? await findById(userId, ETableName.USER) : null;
    if (user != null) {
        const updateRes = await findByIdAndUpdate(
            userId as string,
            req.body,
            ETableName.USER,
            {
                new: true
            }
        );
        return res.status(StatusCodes.OK).json({ userInfo: updateRes });
    }
    return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
};

const getMembers = async (
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const members = await find({}, ETableName.USER);
    if (members != null) {
        return res.status(StatusCodes.OK).json(members);
    } else return res.status(StatusCodes.NOT_FOUND).json("Members not found");
};

const switchLikeStatus = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const userId = getUserId(req);
    const user =
        userId != null ? await findById(userId, ETableName.USER) : null;
    if (user == null) {
        return res.status(StatusCodes.NOT_FOUND).json("User not found");
    }
    const projectId = req.body.projectId;
    const project = await findById(projectId, ETableName.PROJECT);
    if (project == null) {
        return res.status(StatusCodes.NOT_FOUND).json("Project not found");
    }
    if ((user as IUser).likedProjects == null) {
        (user as IUser).likedProjects = [];
    }
    let likedProjects =
        (user as IUser).likedProjects.length > 0
            ? (user as IUser).likedProjects
            : [];
    likedProjects.includes(projectId)
        ? likedProjects.splice(likedProjects.indexOf(projectId), 1)
        : (likedProjects = likedProjects.concat(projectId));
    const updatedData = {
        ...mapUser(user as IUser),
        likedProjects
    };
    const updatedUser = await findByIdAndUpdate(
        userId as string,
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
};

export const UserService = { get, update, getMembers, switchLikeStatus };
