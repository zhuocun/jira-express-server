import sign from "../utils/jwt.util";
import { type DocumentDefinition } from "mongoose";
import userModel, { type IUserModel } from "../models/user.model";
import { type Response } from "express";
import { StatusCodes } from "http-status-codes";

const register = async (
    reqBody: DocumentDefinition<IUserModel>,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    try {
        await userModel.create(reqBody);
        return res.status(StatusCodes.CREATED).json("User created");
    } catch (error) {
        return res.status(StatusCodes.CONFLICT).json("Registration failed");
    }
};

const login = async (
    reqBody: DocumentDefinition<IUserModel>,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const user = (await userModel.findOne(reqBody))?.toJSON();
    if (user == null) {
        return res.status(StatusCodes.UNAUTHORIZED).json("Invalid Credentials");
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
