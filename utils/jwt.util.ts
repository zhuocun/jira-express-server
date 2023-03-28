import jwt from "jsonwebtoken";
import { type FlattenMaps, type LeanDocument } from "mongoose";
import { type IUserModel } from "../models/user.model.js";

const sign = async (
    userInfo: FlattenMaps<LeanDocument<IUserModel>> | undefined
): Promise<string> => {
    return jwt.sign(
        { userInfo },
        process.env.UUID != null ? process.env.UUID : "",
        {
            expiresIn: 60 * 60 * 24
        }
    );
};

export default sign;
