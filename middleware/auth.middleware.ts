import { type NextFunction, type Request, type Response } from "express";
import { type IReq } from "../interfaces/req.js";
import jwt from "jsonwebtoken";
import { type IJwtPayload } from "../interfaces/jwtPayload.js";
import { StatusCodes } from "http-status-codes";

const auth = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> => {
    const token =
        req.headers.authorization != null
            ? req.headers.authorization.split("Bearer ")[1]
            : undefined;
    if (token == null) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ error: "empty JWT" });
    } else {
        try {
            (req as IReq).decryptedJwt = jwt.verify(
                token,
                process.env.UUID != null ? process.env.UUID : ""
            ) as IJwtPayload;
            next();
        } catch (error) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ error: "invalid JWT" });
        }
    }
};

export default auth;
