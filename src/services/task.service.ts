import { DocumentDefinition } from "mongoose";
import kanbanModel from "../models/kanban.model.js";
import { Request, Response } from "express";
import StatusCode from "http-status-codes";
import taskModel, { ITaskModel } from "../models/task.model.js";
import userModel from "../models/user.model.js";
import { getUserId } from "../utils/user.util.js";

const create = async (
    reqBody: DocumentDefinition<ITaskModel>,
    res: Response
) => {
    const { kanbanId, coordinatorId } = reqBody;
    const kanban = await kanbanModel.findById(kanbanId);
    const coordinator = await userModel.findById(coordinatorId);
    if (kanban && coordinator) {
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
        if (!tasks.length) {
            await taskModel.create({
                kanbanId,
                taskName: "Default task",
                coordinatorId: getUserId(req),
                epic: "Default epic",
                type: "Task",
                note: "empty note",
                storyPoints: 1
            });
        }
        res.status(StatusCode.OK).json(tasks);
    }
};

export const TaskService = { create, get };
