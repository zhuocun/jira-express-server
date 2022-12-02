import { Request } from "express";
import { IJwtPayload } from "./jwtPayload.js";

interface IReq extends Request {
    decryptedJwt: IJwtPayload | string;
}
