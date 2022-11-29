import { DocumentDefinition } from "mongoose";
import kanbanModel, { IKanbanModel } from "../models/kanban.model.js";
import { Request, Response } from "express";
import StatusCode from "http-status-codes";
import taskModel, { ITaskModel } from "../models/task.model.js";
import userModel from "../models/user.model.js";
import { getUserId } from "../utils/user.util.js";
import projectModel from "../models/project.model.js";

const create = async (
    reqBody: DocumentDefinition<ITaskModel>,
    res: Response
) => {
    const { kanbanId, coordinatorId, projectId } = reqBody;
    const kanban = await kanbanModel.findById(kanbanId);
    const coordinator = await userModel.findById(coordinatorId);
    const project = await projectModel.findById(projectId);
    if (kanban && coordinator && project) {
        await taskModel.create(reqBody);
        res.status(StatusCode.CREATED).json("Task created");
    } else {
        res.status(StatusCode.NOT_FOUND).json("Lack of task information");
    }
};

const get = async (req: Request, res: Response) => {
    const { projectId } = req.query;
    const kanban: IKanbanModel[] = await kanbanModel.find({ projectId });
    if (kanban.length) {
        for (const k of kanban) {
            const tasks = await taskModel.find({ kanbanId: k._id });
            if (!tasks.length) {
                if (k.kanbanName === "To Do") {
                    await taskModel.create({
                        kanbanId: k._id,
                        projectId,
                        taskName: "Default task",
                        coordinatorId: getUserId(req),
                        epic: "Default epic",
                        type: "Task",
                        note: "No note yet",
                        storyPoints: 1
                    });
                }
                if (k.kanbanName === "In Progress") {
                    await taskModel.create({
                        kanbanId: k._id,
                        projectId,
                        taskName: "Default task",
                        coordinatorId: getUserId(req),
                        epic: "Default epic",
                        type: "Bug",
                        note: "No note yet",
                        storyPoints: 1
                    });
                }
            }
        }
        res.status(StatusCode.OK).json(await taskModel.find({ projectId }));
    } else {
        res.status(StatusCode.NOT_FOUND).json("Kanban not found");
    }
};

const update = async (
    reqBody: DocumentDefinition<ITaskModel>,
    res: Response
) => {
    const taskId = reqBody._id;
    const task = await taskModel.findById(taskId);
    if (task) {
        await taskModel.findByIdAndUpdate(taskId, reqBody);
        res.status(StatusCode.OK).json("Task updated");
    } else {
        res.status(StatusCode.NOT_FOUND).json("Task not found");
    }
};

const remove = async (req: Request, res: Response) => {
    const { taskId } = req.query;
    const task = await taskModel.findById(taskId);
    if (task) {
        await taskModel.findByIdAndDelete(taskId);
        res.status(StatusCode.OK).json("Task deleted");
    } else {
        res.status(StatusCode.NOT_FOUND).json("Task not found");
    }
};

export const TaskService = { create, get, update, remove };
