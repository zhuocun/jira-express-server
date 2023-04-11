import { type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";
import filterRequest from "../utils/req.util.js";
import findById from "../utils/databaseUtils/findById.js";
import ETableName from "../constants/eTableName.js";
import find from "../utils/databaseUtils/find.js";
import createItem from "../utils/databaseUtils/create.js";
import IUser from "../interfaces/user.js";
import IProject from "../interfaces/project.js";
import findByIdAndUpdate from "../utils/databaseUtils/findByIdAndUpdate.js";
import findByIdAndDelete from "../utils/databaseUtils/findByIdAndDelete.js";

const create = async (
    reqBody: IProject,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const user = await findById<IUser>(reqBody.managerId, ETableName.USER);
    if (user != null) {
        await createItem(reqBody, ETableName.PROJECT);
        return res.status(StatusCodes.CREATED).json("Project created");
    } else {
        return res.status(StatusCodes.NOT_FOUND).json("Manager not found");
    }
};

const get = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const { projectName, managerId, projectId } = req.query;
    if (projectId != null) {
        const project = await findById<IProject>(
            projectId as string,
            ETableName.PROJECT
        );
        return res.status(StatusCodes.OK).json(project);
    } else {
        const projects = await find<IProject>(
            filterRequest({
                projectName,
                managerId
            }),
            ETableName.PROJECT
        );
        return res.status(StatusCodes.OK).json(projects);
    }
};

const update = async (
    reqBody: IProject & { _id: string },
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const projectId = reqBody._id;
    const project = await findById<IProject>(projectId, ETableName.PROJECT);
    if (project != null) {
        await findByIdAndUpdate<IProject>(
            projectId,
            reqBody,
            ETableName.PROJECT
        );
        return res.status(StatusCodes.OK).json("Project updated");
    } else {
        return res.status(StatusCodes.NOT_FOUND).json("Project not found");
    }
};

const remove = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const { projectId } = req.query;
    if (projectId != null && typeof projectId === "string") {
        const project = await findById<IProject>(projectId, ETableName.PROJECT);
        if (project != null) {
            await findByIdAndDelete<IProject>(projectId, ETableName.PROJECT);
            return res.status(StatusCodes.OK).json("Project deleted");
        } else {
            return res.status(StatusCodes.NOT_FOUND).json("Project not found");
        }
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json("Bad request");
    }
};

export const ProjectService = { create, get, update, remove };
