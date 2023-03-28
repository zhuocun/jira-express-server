import { type DocumentDefinition } from "mongoose";
import columnModel, { type IColumnModel } from "../models/column.model.js";
import { type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";
import taskModel, { type ITaskModel } from "../models/task.model.js";
import userModel from "../models/user.model.js";
import { getUserId } from "../utils/user.util.js";
import projectModel from "../models/project.model.js";
import type ITaskOrder from "../interfaces/taskOrder.js";
import { quickSort } from "../utils/array.util.js";

const create = async (
    reqBody: DocumentDefinition<ITaskModel>,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const { columnId, coordinatorId, projectId } = reqBody;
    const column = await columnModel.findById(columnId);
    const coordinator = await userModel.findById(coordinatorId);
    const project = await projectModel.findById(projectId);
    if (column != null && coordinator != null && project != null) {
        const tasks = await taskModel.find({ columnId });
        await taskModel.create({ ...reqBody, index: tasks.length });
        return res.status(StatusCodes.CREATED).json("Task created");
    } else {
        return res
            .status(StatusCodes.NOT_FOUND)
            .json("Lack of task information");
    }
};

const get = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const { projectId } = req.query;
    const columns: IColumnModel[] = await columnModel.find({ projectId });
    if (columns.length > 0) {
        for (const c of columns) {
            const allTasks = await taskModel.find({ projectId });
            if (allTasks.length === 0) {
                if (c.columnName === "To Do") {
                    await taskModel.create({
                        columnId: c._id,
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
        return res.status(StatusCodes.OK).json(tasks);
    } else {
        return res.status(StatusCodes.NOT_FOUND).json("Column not found");
    }
};

const update = async (
    reqBody: DocumentDefinition<ITaskModel>,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const taskId = reqBody._id;
    const task = await taskModel.findById(taskId);
    if (task != null) {
        await taskModel.findByIdAndUpdate(taskId, reqBody);
        return res.status(StatusCodes.OK).json("Task updated");
    } else {
        return res.status(StatusCodes.NOT_FOUND).json("Task not found");
    }
};

const remove = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const { taskId } = req.query;
    const task = await taskModel.findById(taskId);
    if (task != null) {
        await taskModel.findByIdAndDelete(taskId);
        return res.status(StatusCodes.OK).json("Task deleted");
    } else {
        return res.status(StatusCodes.NOT_FOUND).json("Task not found");
    }
};

const reorder = async (
    reqBody: DocumentDefinition<ITaskOrder>,
    res: Response
): Promise<Response<any, Record<string, any>> | undefined> => {
    const { type, fromId, referenceId, fromColumnId, referenceColumnId } =
        reqBody;
    const fromColumn = await columnModel.findById(fromColumnId);
    const referenceColumn = await columnModel.findById(referenceColumnId);
    const fromTask = await taskModel.findById(fromId);
    const referenceTask = await taskModel.findById(referenceId);
    if (
        fromColumn != null &&
        referenceColumn != null &&
        fromTask != null &&
        (referenceId == null || referenceTask != null)
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
            if (referenceTask != null) {
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
                return res.status(StatusCodes.OK).json("Task reordered");
            } else {
                await taskModel.findByIdAndUpdate(fromId, {
                    columnId: referenceColumnId,
                    index: referenceColumnTasks.length
                });
                return res.status(StatusCodes.OK).json("Task reordered");
            }
        } else if (
            fromColumnId === referenceColumnId &&
            referenceTask != null
        ) {
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
                return res.status(StatusCodes.OK).json("Task reordered");
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
                return res.status(StatusCodes.OK).json("Task reordered");
            }
        }
    } else {
        return res
            .status(StatusCodes.NOT_FOUND)
            .json("Lack of reordering information");
    }
};
export const TaskService = { create, get, update, remove, reorder };
