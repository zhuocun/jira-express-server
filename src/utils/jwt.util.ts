import jwt from "jsonwebtoken";
import { uuid } from "../configs/default.config.js";
import { FlattenMaps, LeanDocument } from "mongoose";
import { IUserModel } from "../models/user.model.js";

const sign = async (
    userInfo: FlattenMaps<LeanDocument<IUserModel>> | undefined
) => {
    return jwt.sign({ userInfo }, uuid, {
        expiresIn: 60 * 60 * 24
    });
};

export default sign;
