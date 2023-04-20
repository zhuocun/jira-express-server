import { mapUser } from "../utils/user.util.js";
import findById from "../database/CRUD/findById.js";
import ETableName from "../constants/eTableName.js";
import IUser from "../interfaces/user.js";
import findByIdAndUpdate from "../database/CRUD/findByIdAndUpdate.js";
import find from "../database/CRUD/find.js";
import IProject from "../interfaces/project.js";

const get = async (
    userId: string
): Promise<(IUser & { _id: string }) | undefined> => {
    const user = await findById<IUser>(userId, ETableName.USER);
    return user;
};

const update = async (
    userId: string,
    updateData: Partial<IUser>
): Promise<(IUser & { _id: string }) | undefined> => {
    const user = await findById<IUser>(userId, ETableName.USER);
    if (user != null) {
        const updatedUser = await findByIdAndUpdate(
            userId,
            updateData,
            ETableName.USER,
            {
                new: true
            }
        );
        return updatedUser;
    }
};

const getMembers = async (): Promise<
Array<IUser & { _id: string }> | undefined
> => {
    const members = await find<IUser>({}, ETableName.USER);
    return members;
};

const switchLikeStatus = async (
    userId: string,
    projectId: string
): Promise<(IUser & { _id: string }) | undefined> => {
    const user = await findById<IUser>(userId, ETableName.USER);
    const project = await findById<IProject>(projectId, ETableName.PROJECT);

    if (user != null && project != null) {
        if (user.likedProjects == null) {
            user.likedProjects = [];
        }

        let likedProjects =
            user.likedProjects.length > 0 ? user.likedProjects : [];

        if (likedProjects.includes(projectId)) {
            likedProjects.splice(likedProjects.indexOf(projectId), 1);
        } else {
            likedProjects = likedProjects.concat(projectId);
        }

        const updatedData = {
            ...mapUser(user),
            likedProjects
        };

        const updatedUser = await findByIdAndUpdate<IUser>(
            userId,
            updatedData,
            ETableName.USER,
            {
                new: true
            }
        );

        return updatedUser;
    }
};

export const UserService = { get, update, getMembers, switchLikeStatus };
