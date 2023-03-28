import sign from "../utils/jwt.util.js";
import { type DocumentDefinition } from "mongoose";
import userModel, { type IUserModel } from "../models/user.model.js";
import { type Response } from "express";
import { StatusCodes } from "http-status-codes";

const register = async (
    reqBody: DocumentDefinition<IUserModel>,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    await userModel.create(reqBody);
    return res.status(StatusCodes.CREATED).json("User created");
};

const login = async (
    reqBody: DocumentDefinition<IUserModel>,
    res: Response
): Promise<Response<any, Record<string, any>> | undefined> => {
    const user = (await userModel.findOne(reqBody))?.toJSON();
    if (user == null) {
        res.status(StatusCodes.UNAUTHORIZED).json("Invalid Credentials");
    } else {
        const jwt = await sign(user);
        return res.status(StatusCodes.OK).json({
            _id: user._id,
            username: user.username,
            likedProjects: user.likedProjects != null ? user.likedProjects : [],
            email: user.email,
            jwt
        });
    }
};

export const AuthService = { register, login };
