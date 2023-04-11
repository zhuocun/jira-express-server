import sign from "../utils/jwt.util.js";
import { type Response } from "express";
import { StatusCodes } from "http-status-codes";
import findOne from "../utils/databaseUtils/findOne.js";
import IUser from "../interfaces/user.js";
import createItem from "../utils/databaseUtils/create.js";
import ETableName from "../constants/eTableName.js";

const register = async (
    reqBody: IUser,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    try {
        await createItem<IUser>(reqBody, ETableName.USER);
        return res.status(StatusCodes.CREATED).json("User created");
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.CONFLICT).json("Registration failed");
    }
};

const login = async (
    reqBody: IUser,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const user = await findOne<IUser>(reqBody, ETableName.USER);
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
