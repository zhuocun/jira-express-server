import { DocumentDefinition } from "mongoose";
import projectModel, { IProjectModel } from "../models/project.model.js";
import { Request, Response } from "express";
import StatusCode from "http-status-codes";
import UserModel from "../models/user.model.js";
import ProjectModel from "../models/project.model.js";

const create = async (
    reqBody: DocumentDefinition<IProjectModel>,
    res: Response
) => {
    const user = await UserModel.findById(reqBody.managerId);
    if (user) {
        await projectModel.create(reqBody);
        res.status(StatusCode.CREATED).json("Project created");
    } else {
        res.status(StatusCode.NOT_FOUND).json("Manager not found");
    }
};

const get = async (req: Request, res: Response) => {
    const { projectName, managerId } = req.query;
    const projects = (!projectName && !managerId) ?
        await ProjectModel.find() :
        (managerId ?
            await ProjectModel.find({ projectName: projectName, managerId: managerId }) :
            await ProjectModel.find({ projectName: projectName }));
    res.status(StatusCode.OK).json(projects);
};

export const ProjectService = { create, get };
