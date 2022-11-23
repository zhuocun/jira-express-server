import { IReq } from "../interfaces/req.js";
import { Request } from "express";
import { IUserModel } from "../models/user.model.js";
import { IUser } from "../interfaces/user.js";

export const getUserId = (req: Request) => {
    const userObj = (req as IReq).decryptedJwt;
    if (userObj) {
        return typeof userObj !== "string" ? userObj.userInfo?._id : undefined;
    } else return undefined;
};

export const mapUser = (user: IUserModel) => {
    const userInfo: IUser = {
        username: user.username,
        email: user.email,
        password: user.password,
        likedProject: user.likedProject
    };
    return userInfo;
};
