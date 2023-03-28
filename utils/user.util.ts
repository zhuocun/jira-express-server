import { type IReq } from "../interfaces/req.js";
import { type Request } from "express";
import { type IUserModel } from "../models/user.model.js";
import type IUser from "../interfaces/user.js";

export const getUserId = (req: Request): string | undefined => {
    const userObj = (req as IReq).decryptedJwt;
    if (userObj != null) {
        return typeof userObj !== "string" ? userObj.userInfo?._id : undefined;
    } else return undefined;
};

export const mapUser = (user: IUserModel): Partial<IUser> => {
    const userInfo: Partial<IUser> = {
        username: user.username,
        email: user.email,
        likedProjects: user.likedProjects
    };
    return userInfo;
};
