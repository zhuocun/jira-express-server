import { NextFunction, Request, Response } from "express";
import { IReq } from "../interfaces/req.js";
import jwt from "jsonwebtoken";
import { IJwtPayload } from "../interfaces/jwtPayload.js";
import StatusCode from "http-status-codes";

const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization
        ? req.headers.authorization.split("Bearer ")[1]
        : undefined;
    if (!token) {
        res.status(StatusCode.UNAUTHORIZED).json({ error: "empty JWT" });
    } else {
        try {
            (req as IReq).decryptedJwt = jwt.verify(
                token,
                process.env.UUID || ""
            ) as IJwtPayload;
            next();
        } catch (error) {
            res.status(StatusCode.UNAUTHORIZED).json({ error: "invalid JWT" });
        }
    }
};

export default auth;
