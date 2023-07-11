import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest
} from "@jest/globals";
import { AuthService } from "../../services/auth.service.js";
import { AuthController } from "../../controllers/auth.controller.js";

jest.mock("../../services/auth.service.js");

describe("AuthController", () => {
    let mockRequest: Request;
    let mockResponse: Response;
    const mockJson = (body: any): Response<any, Record<string, any>> => {
        return {} as any as Response<any, Record<string, any>>;
    };
    const mockStatus = (code: number): Response<any, Record<string, any>> => {
        return {
            json: jest.fn(mockJson)
        } as any as Response<any, Record<string, any>>;
    };

    beforeEach(() => {
        mockRequest = {} as any as Request;
        mockResponse = {
            status: jest.fn(mockStatus)
        } as any as Response;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should respond with created status when successful", async () => {
        await AuthController.register(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    });

    it("register should respond with internal server error status when registration fails", async () => {
        (
            AuthService.register as jest.MockedFunction<
                typeof AuthService.register
            >
        ).mockRejectedValue(new Error("Registration failed"));

        await AuthController.register(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    });
});
