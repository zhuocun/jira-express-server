import { afterEach, describe, expect, it, jest } from "@jest/globals";
import createItem from "../../database/CRUD/create.js";
import { AuthService } from "../../services/auth.service.js";
import ETableName from "../../constants/eTableName.js";
import handleError from "../../utils/error.util.js";
import IUser from "../../interfaces/user.js";

jest.mock("../../database/CRUD/create.js");
jest.mock("../../utils/error.util.js");

describe("register", () => {
    const mockUser: IUser = {
        username: "test",
        password: "test",
        email: "test",
        likedProjects: []
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should successfully register a user", async () => {
        (
            createItem as jest.MockedFunction<typeof createItem>
        ).mockResolvedValue();

        await expect(AuthService.register(mockUser)).resolves.toEqual(
            "User created"
        );

        expect(createItem).toHaveBeenCalledWith(mockUser, ETableName.USER);
    });

    it("should throw error when createItem fails", async () => {
        const errMsg = "Failed to create user";
        const error = new Error(errMsg);
        (
            createItem as jest.MockedFunction<typeof createItem>
        ).mockRejectedValue(error);
        (
            handleError as jest.MockedFunction<typeof handleError>
        ).mockImplementation((error: any, res: string): Error => {
            if (error instanceof Error) {
                return new Error(error.message);
            } else {
                return new Error(res);
            }
        });
        await expect(AuthService.register(mockUser)).rejects.toThrow(errMsg);

        expect(createItem).toHaveBeenCalledWith(mockUser, ETableName.USER);
        expect(handleError).toHaveBeenCalledWith(error, "Error creating user");
    });
});
