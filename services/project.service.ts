import findById from "../utils/database/CRUD/findById.js";
import ETableName from "../constants/eTableName.js";
import find from "../utils/database/CRUD/find.js";
import createItem from "../utils/database/CRUD/create.js";
import IUser from "../interfaces/user.js";
import IProject from "../interfaces/project.js";
import findByIdAndUpdate from "../utils/database/CRUD/findByIdAndUpdate.js";
import findByIdAndDelete from "../utils/database/CRUD/findByIdAndDelete.js";
import filterRequest from "../utils/req.util.js";

const create = async (reqBody: IProject): Promise<string | null> => {
    const user = await findById<IUser>(reqBody.managerId, ETableName.USER);
    if (user != null) {
        await createItem(reqBody, ETableName.PROJECT);
        return "Project created";
    }
    return null;
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
    if (projectId != null) {
        const project = await findById<IProject>(projectId, ETableName.PROJECT);
        return project;
    } else {
        const projects = await find<IProject>(
            filterRequest({ projectName, managerId }),
            ETableName.PROJECT
        );
        return projects;
    }
};

const update = async (
    reqBody: IProject & { _id: string }
): Promise<string | null> => {
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
};

const remove = async (projectId: string): Promise<string | null> => {
    if (projectId != null && typeof projectId === "string") {
        const project = await findById<IProject>(projectId, ETableName.PROJECT);
        if (project != null) {
            await findByIdAndDelete<IProject>(projectId, ETableName.PROJECT);
            return "Project deleted";
        } else {
            return null;
        }
    } else {
        return "Bad request";
    }
};

export const ProjectService = { create, get, update, remove };
