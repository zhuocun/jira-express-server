import { DocumentDefinition } from "mongoose";
import projectModel, { IProjectModel } from "../models/project.model.js";
import { Request, Response } from "express";
import StatusCode from "http-status-codes";
import UserModel from "../models/user.model.js";
import ProjectModel from "../models/project.model.js";
import filterRequest from "../utils/req.util.js";

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
    const { projectName, managerId, projectId } = req.query;
    if (projectId) {
        const project = await ProjectModel.findById(projectId);
        res.status(StatusCode.OK).json(project);
    } else {
        const projects = await ProjectModel.find(
            filterRequest({
                projectName: projectName,
                managerId: managerId
            })
        );
        res.status(StatusCode.OK).json(projects);
    }
};

const update = async (
    reqBody: DocumentDefinition<IProjectModel>,
    res: Response
) => {
    const projectId = reqBody._id;
    const project = await projectModel.findById(projectId);
    if (project) {
        await projectModel.findByIdAndUpdate(projectId, reqBody);
        res.status(StatusCode.OK).json("Project updated");
    } else {
        res.status(StatusCode.NOT_FOUND).json("Project not found");
    }
};

export const ProjectService = { create, get, update };
