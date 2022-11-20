import { IReq } from "../interfaces/req.js";
import { Request } from "express";

export const getId = (req: Request) => {
    const userObj = (req as IReq).decryptedJwt;
    return typeof userObj !== "string" ? userObj.userInfo._id : undefined;
};
