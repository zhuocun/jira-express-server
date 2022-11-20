import { JwtPayload } from "jsonwebtoken";
import { IUserModel } from "../models/user.model.js";

interface IJwtPayload extends JwtPayload {
    userInfo: IUserModel;
}
