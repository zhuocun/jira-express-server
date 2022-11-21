import userModel from "../models/user.model.js";
import StatusCode from "http-status-codes";
import { Request, Response } from "express";
import { getUserId } from "../utils/user.util.js";
import UserModel from "../models/user.model.js";

const get = async (req: Request, res: Response) => {
    const userId = getUserId(req);
    console.log(userId);
    if (userId) {
        const user = await userModel.findById(userId);
        if (user) {
            return res.status(StatusCode.OK).json({ username: user.username });
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
    if (userId) {
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

export const UserService = { get, update, getMembers };
