import findById from "../database/CRUD/findById.js";
import ETableName from "../constants/eTableName.js";
import find from "../database/CRUD/find.js";
import createItem from "../database/CRUD/create.js";
import IUser from "../interfaces/user.js";
import IProject from "../interfaces/project.js";
import findByIdAndUpdate from "../database/CRUD/findByIdAndUpdate.js";
import findByIdAndDelete from "../database/CRUD/findByIdAndDelete.js";
import filterRequest from "../utils/req.util.js";
import handleError from "../utils/error.util.js";

const create = async (reqBody: IProject): Promise<string | null> => {
    try {
        const user = await findById<IUser>(reqBody.managerId, ETableName.USER);
        if (user != null) {
            await createItem(reqBody, ETableName.PROJECT);
            return "Project created";
        } else {
            return null;
        }
    } catch (error) {
        throw handleError(error, "Error creating project");
    }
};

const get = async (
    projectId: string | undefined,
    projectName: string | undefined,
    managerId: string | undefined
): Promise<
    | (IProject & {
        _id: string
    })
    | Array<
    IProject & {
        _id: string
    }
    >
    | undefined
    > => {
    try {
        if (projectId != null) {
            const project = await findById<IProject>(
                projectId,
                ETableName.PROJECT
            );
            return project;
        } else {
            const projects = await find<IProject>(
                filterRequest({ projectName, managerId }),
                ETableName.PROJECT
            );
            return projects;
        }
    } catch (error) {
        throw handleError(error, "Error getting project(s)");
    }
};

const update = async (
    reqBody: IProject & { _id: string }
): Promise<string | null> => {
    try {
        const projectId = reqBody._id;
        const project = await findById<IProject>(projectId, ETableName.PROJECT);
        if (project != null) {
            await findByIdAndUpdate<IProject>(
                projectId,
                reqBody,
                ETableName.PROJECT
            );
            return "Project updated";
        } else {
            return null;
        }
    } catch (error) {
        throw handleError(error, "Error updating project");
    }
};

const remove = async (projectId: string): Promise<string | null> => {
    try {
        if (projectId != null && typeof projectId === "string") {
            const project = await findById<IProject>(
                projectId,
                ETableName.PROJECT
            );
            if (project != null) {
                await findByIdAndDelete<IProject>(
                    projectId,
                    ETableName.PROJECT
                );
                return "Project deleted";
            } else {
                return "Project not found";
            }
        } else {
            return "Bad request";
        }
    } catch (error) {
        throw handleError(error, "Error deleting project");
    }
};

export const ProjectService = { create, get, update, remove };
