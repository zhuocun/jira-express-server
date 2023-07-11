import ETableName from "../constants/eTableName.js";
import IUser from "../interfaces/user.js";
import createItem from "../database/CRUD/create.js";
import findOne from "../database/CRUD/findOne.js";
import sign from "../utils/jwt.util.js";
import handleError from "../utils/error.util.js";

const register = async (reqBody: IUser): Promise<string> => {
    try {
        await createItem<IUser>(reqBody, ETableName.USER);
        return "User created";
    } catch (error) {
        throw handleError(error, "Error creating user");
    }
};

const login = async (
    reqBody: IUser
): Promise<Partial<IUser> & { _id: string; jwt: string }> => {
    try {
        const user = await findOne<IUser>(reqBody, ETableName.USER);
        if (user != null) {
            const jwt = await sign(user);
            return {
                _id: user._id,
                username: user.username,
                likedProjects:
                    user.likedProjects?.length > 0 ? user.likedProjects : [],
                email: user.email,
                jwt
            };
        } else {
            throw new Error("Invalid Credentials");
        }
    } catch (error) {
        throw handleError(error, "Error logging in");
    }
};

export const AuthService = { register, login };
