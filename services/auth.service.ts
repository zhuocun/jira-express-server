import ETableName from "../constants/eTableName.js";
import IUser from "../interfaces/user.js";
import createItem from "../utils/database/CRUD/create.js";
import findOne from "../utils/database/CRUD/findOne.js";
import sign from "../utils/jwt.util.js";

export const register = async (reqBody: IUser): Promise<string | null> => {
    try {
        await createItem<IUser>(reqBody, ETableName.USER);
        return "User created";
    } catch (error) {
        return null;
    }
};

export const login = async (
    reqBody: IUser
): Promise<(Partial<IUser> & { _id: string, jwt: string }) | null> => {
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
    }
    return null;
};

export const AuthService = { register, login };
