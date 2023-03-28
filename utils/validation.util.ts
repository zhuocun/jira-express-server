import { body } from "express-validator";
import userModel from "../models/user.model.js";
import runValidators from "../middleware/validation.middleware.js";

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
            const emailValidator = await userModel.findOne({ email });
            if (emailValidator != null) {
                return await Promise.reject(
                    new Error("Email has already been registered")
                );
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
            const emailValidator = await userModel.findOne({ email });
            if (emailValidator == null) {
                return await Promise.reject(
                    new Error("Email hasn't been registered")
                );
            }
        }),

    body("password").notEmpty().withMessage("Password cannot be empty").bail()
]);

const updateUser = runValidators([
    body("email").custom(async (email: string) => {
        const emailValidator = await userModel.findOne({ email });
        if (emailValidator != null) {
            return await Promise.reject(new Error("Email has been registered"));
        }
    }),

    body("username").custom(async (username: string) => {
        const usernameValidator = await userModel.findOne({
            username
        });
        if (usernameValidator != null) {
            return await Promise.reject(
                new Error("Username has been registered")
            );
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

const createColumn = runValidators([
    body("columnName")
        .notEmpty()
        .withMessage("Column name cannot be empty")
        .bail(),

    body("projectId")
        .notEmpty()
        .withMessage("Project ID cannot be empty")
        .bail()
]);

const createTask = runValidators([
    body("projectId")
        .notEmpty()
        .withMessage("Project ID cannot be empty")
        .bail(),

    body("columnId").notEmpty().withMessage("Column ID cannot be empty").bail(),

    body("epic").notEmpty().withMessage("Epic cannot be empty").bail(),

    body("storyPoints")
        .notEmpty()
        .withMessage("Story points cannot be empty")
        .bail(),

    body("taskName").notEmpty().withMessage("Task name cannot be empty").bail(),

    body("type").notEmpty().withMessage("Task type cannot be empty").bail(),

    body("note").notEmpty().withMessage("Task note cannot be empty").bail()
]);

export const Validator = {
    register,
    login,
    updateUser,
    createProject,
    createColumn,
    createTask
};
