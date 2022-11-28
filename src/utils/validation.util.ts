import { body } from "express-validator";
import userModel from "../models/user.model.js";
import runValidators from "../middlewares/validation.middleware.js";

const register = runValidators([
    body("username")
        .notEmpty()
        .withMessage("Username cannot be empty")
        .bail()
        .isLength({ min: 3 })
        .withMessage("Length of username cannot be less than 3")
        .bail(),

    body("email")
        .notEmpty()
        .withMessage("Email cannot be empty")
        .bail()
        .isEmail()
        .withMessage("The input is not an email address")
        .bail()
        .custom(async (email: string) => {
            const emailValidator = await userModel.findOne({ email: email });
            if (emailValidator) {
                return Promise.reject("Email has already been registered");
            }
        })
        .bail(),

    body("password")
        .notEmpty()
        .withMessage("Password cannot be empty")
        .bail()
        .isLength({ min: 5 })
        .withMessage("Length of password cannot be less than 5")
        .bail()
]);

const login = runValidators([
    body("email")
        .notEmpty()
        .withMessage("Email cannot be empty")
        .bail()
        .isEmail()
        .withMessage("The input is not an email address")
        .bail()
        .custom(async (email: string) => {
            const emailValidator = await userModel.findOne({ email: email });
            if (!emailValidator) {
                return Promise.reject("Email hasn't been registered");
            }
        }),

    body("password").notEmpty().withMessage("Password cannot be empty").bail()
]);

const updateUser = runValidators([
    body("email").custom(async (email: string) => {
        const emailValidator = await userModel.findOne({ email: email });
        if (emailValidator) {
            return Promise.reject("Email has been registered");
        }
    }),

    body("username").custom(async (username: string) => {
        const usernameValidator = await userModel.findOne({
            username: username
        });
        if (usernameValidator) {
            return Promise.reject("Username has been registered");
        }
    })
]);

const createProject = runValidators([
    body("projectName")
        .notEmpty()
        .withMessage("Project name cannot be empty")
        .bail(),

    body("organization")
        .notEmpty()
        .withMessage("Organization cannot be empty")
        .bail(),

    body("managerId")
        .notEmpty()
        .withMessage("Manager id cannot be empty")
        .bail()
]);

const createKanban = runValidators([
    body("kanbanName")
        .notEmpty()
        .withMessage("Kanban name cannot be empty")
        .bail(),

    body("projectId")
        .notEmpty()
        .withMessage("Project ID cannot be empty")
        .bail()
]);

export const Validator = { register, login, updateUser, createProject, createKanban };
