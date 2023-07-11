import { type IReq } from "../interfaces/req.js";
import { type Request } from "express";
import type IUser from "../interfaces/user.js";

const getUserId = (req: Request): string | undefined => {
    const userObj = (req as IReq).decryptedJwt;
    if (userObj != null) {
        return typeof userObj !== "string" ? userObj.userInfo?._id : undefined;
    } else return undefined;
};

const mapUser = (user: IUser): Partial<IUser> => {
    const userInfo: Partial<IUser> = {
        username: user.username,
        email: user.email,
        likedProjects: user.likedProjects
    };
    return userInfo;
};

export { getUserId, mapUser };
