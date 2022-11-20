import mongoose from "mongoose";
import encrypt from "../utils/encryption.util.js";
import { baseModel } from "./base.model.js";
import { IUser } from "../interfaces/user.js";

export interface IUserModel extends IUser, mongoose.Document {
}

const userSchema = new mongoose.Schema<IUserModel>({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        set: (value: string) => encrypt(value),
        select: false
    },
    ...baseModel
});

const userModel = mongoose.model<IUserModel>("User", userSchema);

export default userModel;
