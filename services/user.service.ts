import userModel from "../models/user.model.js";
import { StatusCodes } from "http-status-codes";
import { type Request, type Response } from "express";
import { getUserId, mapUser } from "../utils/user.util.js";
import projectModel from "../models/project.model.js";

const get = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const userId = getUserId(req);
    if (userId != null) {
        const user = await userModel.findById(userId);
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
    const user = userId != null ? await userModel.findById(userId) : null;
    if (user != null) {
        const updateRes = await userModel.findByIdAndUpdate(userId, req.body, {
            new: true
        });
        return res.status(StatusCodes.OK).json({ userInfo: updateRes });
    }
    return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
};

const getMembers = async (
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const members = await userModel.find();
    if (members != null) {
        return res.status(StatusCodes.OK).json(members);
    } else return res.status(StatusCodes.NOT_FOUND).json("Members not found");
};

const switchLikeStatus = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const userId = getUserId(req);
    const user = userId != null ? await userModel.findById(userId) : null;
    if (user == null) {
        return res.status(StatusCodes.NOT_FOUND).json("User not found");
    }
    const projectId = req.body.projectId;
    const project = await projectModel.findById(projectId);
    if (project == null) {
        return res.status(StatusCodes.NOT_FOUND).json("Project not found");
    }
    let likedProjects = user.likedProjects;
    likedProjects.includes(projectId)
        ? likedProjects.splice(likedProjects.indexOf(projectId), 1)
        : (likedProjects = likedProjects.concat(projectId));
    const updatedData = {
        ...mapUser(user),
        likedProjects
    };
    const updatedUser = await userModel.findByIdAndUpdate(userId, updatedData, {
        new: true
    });
    if (updatedUser != null) {
        return res.status(StatusCodes.OK).json({
            username: updatedUser.username,
            likedProjects: updatedUser.likedProjects
        });
    } else return res.status(StatusCodes.NOT_FOUND).json("User not found");
};

export const UserService = { get, update, getMembers, switchLikeStatus };
