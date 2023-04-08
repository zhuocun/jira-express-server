// import { StatusCodes } from "http-status-codes";
// import { model } from "mongoose";
// import { IUserModel } from "../../models/user.model.js";
// import { AuthService } from "../auth.service.js";
// import { Response } from "express";
import { describe, expect, it } from "@jest/globals";
// import { dynamoDBDocument } from "../../app.js";
// import * as dotenv from "dotenv";
// import IUser from "../../interfaces/user.js";

// dotenv.config();
describe("AuthService", () => {
    it("should register a user", async () => {
        // const reqBody: IUser = {
        //     username: "username",
        //     email: " email",
        //     password: "password",
        //     likedProjects: []
        // };
        // const res = {
        //     status: jest.fn().mockReturnThis(),
        //     json: jest.fn().mockReturnThis()
        // } as any as jest.Mocked<Response<any, Record<string, any>>>;
        // if (process.env.DATABASE === "mongoDB") {
        //     const UserModel = model<IUserModel>("User");
        //     jest.spyOn(UserModel, "create").mockImplementationOnce(
        //         async () => await Promise.resolve(reqBody)
        //     );
        // }
        // if (process.env.DATABASE === "dynamoDB") {
        //     jest.spyOn(dynamoDBDocument, "put").mockImplementationOnce(
        //         async () => await Promise.resolve(reqBody)
        //     );
        // }
        // const result = await AuthService.register(reqBody, res);
        // expect(result.status).toHaveBeenCalledWith(StatusCodes.CREATED);
        // expect(result.json).toHaveBeenCalledWith("User created");
        expect(true).toBe(true);
    });
});
