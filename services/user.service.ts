import { mapUser } from "../utils/user.util.js";
import findById from "../database/CRUD/findById.js";
import ETableName from "../constants/eTableName.js";
import IUser from "../interfaces/user.js";
import findByIdAndUpdate from "../database/CRUD/findByIdAndUpdate.js";
import find from "../database/CRUD/find.js";
import IProject from "../interfaces/project.js";
import handleError from "../utils/error.util.js";

const get = async (
    userId: string
): Promise<(IUser & { _id: string }) | undefined> => {
    try {
        const user = await findById<IUser>(userId, ETableName.USER);
        return user;
    } catch (error) {
        throw handleError(error, "Error getting user");
    }
};

const update = async (
    userId: string,
    updateData: Partial<IUser>
): Promise<(IUser & { _id: string }) | string> => {
    try {
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
            if (updatedUser != null) {
                return updatedUser;
            } else {
                throw new Error("Error updating user");
            }
        } else {
            return "User not found";
        }
    } catch (error) {
        throw handleError(error, "Error updating user");
    }
};

const getMembers = async (): Promise<
Array<IUser & { _id: string }> | undefined
> => {
    try {
        const members = await find<IUser>({}, ETableName.USER);
        return members;
    } catch (error) {
        throw handleError(error, "Error getting members");
    }
};

const switchLikeStatus = async (
    userId: string,
    projectId: string
): Promise<(IUser & { _id: string }) | string | undefined> => {
    try {
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
            if (updatedUser != null) {
                return updatedUser;
            } else {
                throw new Error("Error updating user");
            }
        } else {
            return "User or project not found";
        }
    } catch (error) {
        throw handleError(error, "Error updating user");
    }
};

export const UserService = { get, update, getMembers, switchLikeStatus };
