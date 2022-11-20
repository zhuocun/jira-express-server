import { ValidationChain, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import StatusCode from "http-status-codes";

const runValidators = (validators: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validators.map((v) => v.run(req)));
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res
                .status(StatusCode.BAD_REQUEST)
                .json({ error: err.array() });
        } else {
            next();
        }
    };
};

export default runValidators;
