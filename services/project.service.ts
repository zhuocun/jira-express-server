import { type DocumentDefinition } from "mongoose";
import projectModel, { type IProjectModel } from "../models/project.model.js";
import { type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";
import UserModel from "../models/user.model.js";
import filterRequest from "../utils/req.util.js";
import findById from "../utils/databaseUtils/findById.js";
import ETableName from "../constants/eTableName.js";
import find from "../utils/databaseUtils/find.js";

const create = async (
    reqBody: DocumentDefinition<IProjectModel>,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const user = await UserModel.findById(reqBody.managerId);
    if (user != null) {
        await projectModel.create(reqBody);
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
        const project = await findById(projectId as string, ETableName.PROJECT);
        return res.status(StatusCodes.OK).json(project);
    } else {
        const projects = await find(
            filterRequest({
                projectName,
                managerId
            }), ETableName.PROJECT
        );
        return res.status(StatusCodes.OK).json(projects);
    }
};

const update = async (
    reqBody: DocumentDefinition<IProjectModel>,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const projectId = reqBody._id;
    const project = await projectModel.findById(projectId);
    if (project != null) {
        await projectModel.findByIdAndUpdate(projectId, reqBody);
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
    const task = await projectModel.findById(projectId);
    if (task != null) {
        await projectModel.findByIdAndDelete(projectId);
        return res.status(StatusCodes.OK).json("Project deleted");
    } else {
        return res.status(StatusCodes.NOT_FOUND).json("Project not found");
    }
};

export const ProjectService = { create, get, update, remove };
