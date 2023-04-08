import { type Request } from "express";
import { type IJwtPayload } from "./jwtPayload.js";

interface IReq extends Request {
    decryptedJwt: IJwtPayload | string;
}
