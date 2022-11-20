import sign from "../utils/jwt.util.js";
import { DocumentDefinition } from "mongoose";
import userModel, { IUserModel } from "../models/user.model.js";
import { Response } from "express";
import StatusCode from "http-status-codes";

const register = async (
    reqBody: DocumentDefinition<IUserModel>,
    res: Response
) => {
    await new userModel(reqBody).save();
    res.status(StatusCode.CREATED).json("User created");
};

const login = async (
    reqBody: DocumentDefinition<IUserModel>,
    res: Response
) => {
    const user = (await userModel.findOne(reqBody))?.toJSON();
    if (!user) {
        res.status(StatusCode.UNAUTHORIZED).send("Invalid Credentials");
    } else {
        const jwt = await sign(user);
        res.status(StatusCode.OK).json({ username: user.username, jwt: jwt });
    }
};

export const AuthService = { register, login };
