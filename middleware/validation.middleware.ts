import { type ValidationChain, validationResult } from "express-validator";
import { type NextFunction, type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";

const runValidators = (validators: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validators.map(async (v) => await v.run(req)));
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ error: err.array() });
        } else {
            next();
        }
    };
};

export default runValidators;
