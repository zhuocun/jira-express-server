import { DocumentDefinition } from "mongoose";
import kanbanModel from "../models/kanban.model.js";
import { Request, Response } from "express";
import projectModel from "../models/project.model.js";
import StatusCode from "http-status-codes";
import taskModel, { ITaskModel } from "../models/task.model.js";
import userModel from "../models/user.model.js";

const create = async (
    reqBody: DocumentDefinition<ITaskModel>,
    res: Response
) => {
    const { projectId, kanbanId, coordinatorId } = reqBody;
    const project = await projectModel.findById(projectId);
    const kanban = await kanbanModel.findById(kanbanId);
    const coordinator = await userModel.findById(coordinatorId);
    if (project && kanban && coordinator) {
        await taskModel.create(reqBody);
        res.status(StatusCode.CREATED).json("Task created");
    } else {
        res.status(StatusCode.NOT_FOUND).json("Lack of task information");
    }
};

const get = async (req: Request, res: Response) => {
    const { kanbanId } = req.query;
    const kanban = await kanbanModel.findById(kanbanId);
    if (kanban) {
        const tasks = await taskModel.find({ kanbanId });
        res.status(StatusCode.OK).json(tasks);
    }
};

export const TaskService = { create, get };
