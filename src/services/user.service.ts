import userModel from "../models/user.model.js";
import StatusCode from "http-status-codes";
import { Request, Response } from "express";
import { getUserId, mapUser } from "../utils/user.util.js";
import UserModel from "../models/user.model.js";
import projectModel from "../models/project.model.js";

const get = async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (userId) {
        const user = await userModel.findById(userId);
        if (user) {
            return res.status(StatusCode.OK).json({
                username: user.username,
                likedProjects: user.likedProjects
            });
        } else {
            return res
                .status(StatusCode.NOT_FOUND)
                .json({ error: "User not found" });
        }
    }
    return res.status(StatusCode.NOT_FOUND).json({ error: "User not found" });
};

const update = async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const user = userId ? await userModel.findById(userId) : null;
    if (user) {
        const updateRes = await userModel.findByIdAndUpdate(userId, req.body, {
            new: true
        });
        return res.status(StatusCode.OK).json({ userInfo: updateRes });
    }
    return res.status(StatusCode.NOT_FOUND).json({ error: "User not found" });
};

const getMembers = async (res: Response) => {
    const members = await UserModel.find();
    if (members) {
        return res.status(StatusCode.OK).json(members);
    } else return res.status(StatusCode.NOT_FOUND).json("Members not found");
};

const switchLikeStatus = async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const user = userId ? await UserModel.findById(userId) : null;
    if (!user) {
        return res.status(StatusCode.NOT_FOUND).json("User not found");
    }
    const projectId = req.body.projectId;
    const project = await projectModel.findById(projectId);
    if (!project) {
        return res.status(StatusCode.NOT_FOUND).json("Project not found");
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
    if (updatedUser) {
        res.status(StatusCode.OK).json({
            username: updatedUser.username,
            likedProjects: updatedUser.likedProjects
        });
    } else return res.status(StatusCode.NOT_FOUND).json("User not found");
};

export const UserService = { get, update, getMembers, switchLikeStatus };
