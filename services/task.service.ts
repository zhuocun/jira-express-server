import { DocumentDefinition } from "mongoose";
import columnModel, { IColumnModel } from "../models/column.model.js";
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
    const { columnId, coordinatorId, projectId } = reqBody;
    const column = await columnModel.findById(columnId);
    const coordinator = await userModel.findById(coordinatorId);
    const project = await projectModel.findById(projectId);
    if (column && coordinator && project) {
        const tasks = await taskModel.find({ columnId: columnId });
        await taskModel.create({ ...reqBody, index: tasks.length });
        res.status(StatusCode.CREATED).json("Task created");
    } else {
        res.status(StatusCode.NOT_FOUND).json("Lack of task information");
    }
};

const get = async (req: Request, res: Response) => {
    const { projectId } = req.query;
    const columns: IColumnModel[] = await columnModel.find({ projectId });
    if (columns.length) {
        for (const k of columns) {
            const allTasks = await taskModel.find({ projectId });
            if (!allTasks.length) {
                if (k.columnName === "To Do") {
                    await taskModel.create({
                        columnId: k._id,
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
        res.status(StatusCode.NOT_FOUND).json("Column not found");
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
    const { type, fromId, referenceId, fromColumnId, referenceColumnId } =
        reqBody;
    const fromColumn = await columnModel.findById(fromColumnId);
    const referenceColumn = await columnModel.findById(referenceColumnId);
    const fromTask = await taskModel.findById(fromId);
    const referenceTask = await taskModel.findById(referenceId);
    if (
        fromColumn &&
        referenceColumn &&
        fromTask &&
        (!referenceId || referenceTask)
    ) {
        const fromColumnTasks = await taskModel.find({
            columnId: fromColumnId
        });
        const referenceColumnTasks = await taskModel.find({
            columnId: referenceColumnId
        });
        if (fromColumnId !== referenceColumnId) {
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
                    columnId: referenceColumnId,
                    index: referenceTask.index
                });
                res.status(StatusCode.OK).json("Task reordered");
            } else {
                await taskModel.findByIdAndUpdate(fromId, {
                    columnId: referenceColumnId,
                    index: referenceColumnTasks.length
                });
                res.status(StatusCode.OK).json("Task reordered");
            }
        } else if (fromColumnId === referenceColumnId && referenceTask) {
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
