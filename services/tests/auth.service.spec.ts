import { StatusCodes } from "http-status-codes";
import { DocumentDefinition, model } from "mongoose";
import { IUserModel } from "../../models/user.model.js";
import { AuthService } from "../auth.service.js";
import { Response } from "express";
import { describe, expect, it, jest } from "@jest/globals";

describe("AuthService", () => {
    it("should register a user", async () => {
        const UserModel = model<IUserModel>("User");
        const reqBody: DocumentDefinition<IUserModel> = {
            username: "username",
            email: " email",
            password: "password",
            likedProjects: []
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        } as any as jest.Mocked<Response<any, Record<string, any>>>;

        jest.spyOn(UserModel, "create").mockImplementationOnce(
            async () => await Promise.resolve(reqBody)
        );

        const result = await AuthService.register(reqBody, res);

        expect(result.status).toHaveBeenCalledWith(StatusCodes.CREATED);
        expect(result.json).toHaveBeenCalledWith("User created");
    });
});
