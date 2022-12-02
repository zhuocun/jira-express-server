import { DocumentDefinition } from "mongoose";
import kanbanModel, { IKanbanModel } from "../models/kanban.model.js";
import { Request, Response } from "express";
import StatusCode from "http-status-codes";
import taskModel, { ITaskModel } from "../models/task.model.js";
import userModel from "../models/user.model.js";
import { getUserId } from "../utils/user.util.js";
import projectModel from "../models/project.model.js";
import ITaskOrder from "../interfaces/taskOrder.js";
import { quickSort } from "../utils/array.util.js";

const create = async (
    reqBody: DocumentDefinition<ITaskModel>,
    res: Response
) => {
    const { kanbanId, coordinatorId, projectId } = reqBody;
    const kanban = await kanbanModel.findById(kanbanId);
    const coordinator = await userModel.findById(coordinatorId);
    const project = await projectModel.findById(projectId);
    if (kanban && coordinator && project) {
        const tasks = await taskModel.find({ kanbanId });
        await taskModel.create({ ...reqBody, index: tasks.length });
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
            const allTasks = await taskModel.find({ projectId });
            if (!allTasks.length) {
                if (k.kanbanName === "To Do") {
                    await taskModel.create({
                        kanbanId: k._id,
                        projectId,
                        taskName: "Default Task",
                        coordinatorId: getUserId(req),
                        epic: "Default epic",
                        type: "Task",
                        note: "No note yet",
                        storyPoints: 1,
                        index: 0
                    });
                }
            }
        }
        const tasks = await taskModel.find({ projectId });
        quickSort(tasks);
        res.status(StatusCode.OK).json(tasks);
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

const reorder = async (
    reqBody: DocumentDefinition<ITaskOrder>,
    res: Response
) => {
    const { type, fromId, referenceId, fromKanbanId, referenceKanbanId } =
        reqBody;
    const fromKanban = await kanbanModel.findById(fromKanbanId);
    const referenceKanban = await kanbanModel.findById(referenceKanbanId);
    const fromTask = await taskModel.findById(fromId);
    const referenceTask = await taskModel.findById(referenceId);
    if (
        fromKanban &&
        referenceKanban &&
        fromTask &&
        (!referenceId || referenceTask)
    ) {
        const fromColumnTasks = await taskModel.find({
            kanbanId: fromKanbanId
        });
        const referenceColumnTasks = await taskModel.find({
            kanbanId: referenceKanbanId
        });
        if (fromKanbanId !== referenceKanbanId) {
            for (const t of fromColumnTasks) {
                if (t.index > fromTask.index) {
                    await taskModel.findByIdAndUpdate(t._id, {
                        index: t.index - 1
                    });
                }
            }
            if (referenceTask) {
                for (const t of referenceColumnTasks) {
                    if (t.index >= referenceTask.index) {
                        await taskModel.findByIdAndUpdate(t._id, {
                            index: t.index + 1
                        });
                    }
                }
                await taskModel.findByIdAndUpdate(fromId, {
                    kanbanId: referenceKanbanId,
                    index: referenceTask.index
                });
                res.status(StatusCode.OK).json("Task reordered");
            } else {
                await taskModel.findByIdAndUpdate(fromId, {
                    kanbanId: referenceKanbanId,
                    index: referenceColumnTasks.length
                });
                res.status(StatusCode.OK).json("Task reordered");
            }
        } else if (fromKanbanId === referenceKanbanId && referenceTask) {
            if (type === "before") {
                for (const t of referenceColumnTasks) {
                    if (
                        t.index > referenceTask.index &&
                        t.index < fromTask.index
                    ) {
                        await taskModel.findByIdAndUpdate(t._id, {
                            index: t.index + 1
                        });
                    }
                }
                await taskModel.findByIdAndUpdate(fromId, {
                    index: referenceTask.index
                });
                await taskModel.findByIdAndUpdate(referenceId, {
                    index: referenceTask.index + 1
                });
                res.status(StatusCode.OK).json("Task reordered");
            } else if (type === "after") {
                for (const t of referenceColumnTasks) {
                    if (
                        t.index > fromTask.index &&
                        t.index < referenceTask.index
                    ) {
                        await taskModel.findByIdAndUpdate(t._id, {
                            index: t.index - 1
                        });
                    }
                }
                await taskModel.findByIdAndUpdate(referenceId, {
                    index: referenceTask.index - 1
                });
                await taskModel.findByIdAndUpdate(fromId, {
                    index: referenceTask.index
                });
                res.status(StatusCode.OK).json("Task reordered");
            }
        }
    } else {
        res.status(StatusCode.NOT_FOUND).json("Lack of reordering information");
    }
};
export const TaskService = { create, get, update, remove, reorder };
