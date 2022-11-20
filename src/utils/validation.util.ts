import { body } from "express-validator";
import userModel from "../models/user.model.js";
import runValidators from "../middlewares/validation.middleware.js";

const register = runValidators([
    body("username")
        .notEmpty()
        .withMessage("username cannot be empty")
        .bail()
        .isLength({ min: 3 })
        .withMessage("length of username cannot be less than 3")
        .bail(),

    body("email")
        .notEmpty()
        .withMessage("email cannot be empty")
        .bail()
        .isEmail()
        .withMessage("the input is not an email address")
        .bail()
        .custom(async (email: string) => {
            const emailValidator = await userModel.findOne({ email: email });
            if (emailValidator) {
                return Promise.reject("email has already been registered");
            }
        })
        .bail(),

    body("password")
        .notEmpty()
        .withMessage("password cannot be empty")
        .bail()
        .isLength({ min: 5 })
        .withMessage("length of password cannot be less than 5")
        .bail()
]);

const login = runValidators([
    body("email")
        .notEmpty()
        .withMessage("email cannot be empty")
        .bail()
        .isEmail()
        .withMessage("the input is not an email address")
        .bail()
        .custom(async (email: string) => {
            const emailValidator = await userModel.findOne({ email: email });
            if (!emailValidator) {
                return Promise.reject("email hasn't been registered");
            }
        }),

    body("password").notEmpty().withMessage("password cannot be empty").bail()
]);

const update = runValidators([
    body("email").custom(async (email: string) => {
        const emailValidator = await userModel.findOne({ email: email });
        if (emailValidator) {
            return Promise.reject("email has been registered");
        }
    }),

    body("username").custom(async (username: string) => {
        const usernameValidator = await userModel.findOne({
            username: username
        });
        if (usernameValidator) {
            return Promise.reject("username has been registered");
        }
    })
]);

export const Validation = { register, login, update };
