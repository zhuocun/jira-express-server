import { IReq } from "../interfaces/req.js";
import { Request } from "express";

export const getUserId = (req: Request) => {
    const userObj = (req as IReq).decryptedJwt;
    if (userObj) {
        return typeof userObj !== "string" ? userObj.userInfo?._id : undefined;
    } else return undefined;
};
