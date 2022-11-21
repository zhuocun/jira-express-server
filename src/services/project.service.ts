import { DocumentDefinition } from "mongoose";
import projectModel, { IProjectModel } from "../models/project.model.js";
import { Response } from "express";
import StatusCode from "http-status-codes";
import UserModel from "../models/user.model.js";
import ProjectModel from "../models/project.model.js";

const create = async (reqBody: DocumentDefinition<IProjectModel>, res: Response) => {
    const user = await UserModel.findById(reqBody.managerId);
    if (user) {
        await projectModel.create({ ...reqBody, createdAt: "123" });
        res.status(StatusCode.CREATED).json("Project created");
    } else {
        res.status(StatusCode.NOT_FOUND).json("Manager not found");
    }
};

const get = async (res: Response) => {
    const projects = await ProjectModel.find();
    if (projects) {
        res.status(StatusCode.OK).json(projects);
    } else {
        res.status(StatusCode.NOT_FOUND).json("Projects not found");
    }
};
export const ProjectService = { create, get };
