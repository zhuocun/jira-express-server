import { type JwtPayload } from "jsonwebtoken";
import { type IUserModel } from "../models/user.model.js";

interface IJwtPayload extends JwtPayload {
    userInfo: IUserModel;
}
