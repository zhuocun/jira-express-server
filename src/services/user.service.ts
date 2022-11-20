import userModel from "../models/user.model.js";
import StatusCode from "http-status-codes";
import { Request, Response } from "express";
import { getId } from "../utils/user.util.js";

const update = async (req: Request, res: Response) => {
    const userId = getId(req);
    if (userId) {
        const updateRes = await userModel.findByIdAndUpdate(userId, req.body, {
            new: true
        });
        return res.status(StatusCode.OK).json({ userInfo: updateRes });
    }
    return res.status(StatusCode.NOT_FOUND).json({ error: "User not found" });
};

export const UserService = { update };
