import { type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getUserId } from "../utils/user.util.js";
import type ITaskOrder from "../interfaces/taskOrder.js";
import { quickSort } from "../utils/array.util.js";
import findById from "../utils/databaseUtils/findById.js";
import ETableName from "../constants/eTableName.js";
import find from "../utils/databaseUtils/find.js";
import createItem from "../utils/databaseUtils/create.js";
import findByIdAndUpdate from "../utils/databaseUtils/findByIdAndUpdate.js";
import ITask from "../interfaces/task.js";
import IColumn from "../interfaces/column.js";
import IUser from "../interfaces/user.js";
import IProject from "../interfaces/project.js";
import findByIdAndDelete from "../utils/databaseUtils/findByIdAndDelete.js";

const create = async (
    reqBody: ITask,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const { columnId, coordinatorId, projectId } = reqBody;
    const column = await findById<IColumn>(columnId, ETableName.COLUMN);
    const coordinator = await findById<IUser>(coordinatorId, ETableName.USER);
    const project = await findById<IProject>(projectId, ETableName.PROJECT);
    if (column != null && coordinator != null && project != null) {
        const tasks = await find<ITask>({ columnId }, ETableName.TASK);
        await createItem({ ...reqBody, index: tasks?.length }, ETableName.TASK);
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
    if (typeof projectId === "string") {
        const columns = await find<IColumn>({ projectId }, ETableName.COLUMN);
        if (columns != null) {
            for (const c of columns) {
                const allTasks = await find<ITask>(
                    { projectId },
                    ETableName.TASK
                );
                if (allTasks == null) {
                    if (c.columnName === "To Do") {
                        await createItem(
                            {
                                columnId: c._id,
                                projectId,
                                taskName: "Default Task",
                                coordinatorId: getUserId(req),
                                epic: "Default epic",
                                type: "Task",
                                note: "No note yet",
                                storyPoints: 1,
                                index: 0
                            },
                            ETableName.TASK
                        );
                    }
                }
            }
            const tasks = await find<ITask>({ projectId }, ETableName.TASK);
            quickSort(tasks as Array<{ index: number }>);
            return res.status(StatusCodes.OK).json(tasks);
        } else {
            return res.status(StatusCodes.NOT_FOUND).json("Column not found");
        }
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json("Bad request");
    }
};

const update = async (
    reqBody: ITask & { _id: string },
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const taskId = reqBody._id;
    const task = await findById<ITask>(taskId, ETableName.TASK);
    if (task != null) {
        await findByIdAndUpdate(taskId, reqBody, ETableName.TASK);
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
    if (typeof taskId === "string") {
        const task = await findById<ITask>(taskId, ETableName.TASK);
        if (task != null) {
            await findByIdAndDelete<ITask>(taskId, ETableName.TASK);
            return res.status(StatusCodes.OK).json("Task deleted");
        } else {
            return res.status(StatusCodes.NOT_FOUND).json("Task not found");
        }
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json("Bad request");
    }
};

const reorder = async (
    reqBody: ITaskOrder,
    res: Response
): Promise<Response<any, Record<string, any>> | undefined> => {
    const { type, fromId, referenceId, fromColumnId, referenceColumnId } =
        reqBody;
    const fromColumn = await findById<IColumn>(fromColumnId, ETableName.COLUMN);
    const referenceColumn = await findById<IColumn>(
        referenceColumnId,
        ETableName.COLUMN
    );
    const fromTask = await findById<ITask>(fromId, ETableName.TASK);
    const referenceTask = await findById<ITask>(referenceId, ETableName.TASK);
    if (
        fromColumn != null &&
        referenceColumn != null &&
        fromTask != null &&
        (referenceId == null || referenceTask != null)
    ) {
        const fromColumnTasks = await find<ITask>(
            {
                columnId: fromColumnId
            },
            ETableName.TASK
        );
        const referenceColumnTasks = await find<ITask>(
            {
                columnId: referenceColumnId
            },
            ETableName.TASK
        );
        if (
            fromColumnId !== referenceColumnId &&
            fromColumnTasks != null &&
            referenceColumnTasks != null
        ) {
            for (const t of fromColumnTasks) {
                if (t.index > fromTask.index) {
                    await findByIdAndUpdate<ITask>(
                        t._id,
                        {
                            index: t.index - 1
                        },
                        ETableName.TASK
                    );
                }
            }
            if (referenceTask != null) {
                for (const t of referenceColumnTasks) {
                    if (t.index >= referenceTask.index) {
                        await findByIdAndUpdate<ITask>(
                            t._id,
                            {
                                index: t.index + 1
                            },
                            ETableName.TASK
                        );
                    }
                }
                await findByIdAndUpdate<ITask>(
                    fromId,
                    {
                        columnId: referenceColumnId,
                        index: referenceTask.index
                    },
                    ETableName.TASK
                );
                return res.status(StatusCodes.OK).json("Task reordered");
            } else {
                await findByIdAndUpdate<ITask>(
                    fromId,
                    {
                        columnId: referenceColumnId,
                        index: referenceColumnTasks.length
                    },
                    ETableName.TASK
                );
                return res.status(StatusCodes.OK).json("Task reordered");
            }
        } else if (
            fromColumnId === referenceColumnId &&
            referenceTask != null &&
            referenceColumnTasks != null
        ) {
            if (type === "before") {
                for (const t of referenceColumnTasks) {
                    if (
                        t.index > referenceTask.index &&
                        t.index < fromTask.index
                    ) {
                        await findByIdAndUpdate<ITask>(
                            t._id,
                            {
                                index: t.index + 1
                            },
                            ETableName.TASK
                        );
                    }
                }
                await findByIdAndUpdate<ITask>(
                    fromId,
                    {
                        index: referenceTask.index
                    },
                    ETableName.TASK
                );
                await findByIdAndUpdate<ITask>(
                    referenceId,
                    {
                        index: referenceTask.index + 1
                    },
                    ETableName.TASK
                );
                return res.status(StatusCodes.OK).json("Task reordered");
            } else if (type === "after") {
                for (const t of referenceColumnTasks) {
                    if (
                        t.index > fromTask.index &&
                        t.index < referenceTask.index
                    ) {
                        await findByIdAndUpdate(
                            t._id,
                            {
                                index: t.index - 1
                            },
                            ETableName.TASK
                        );
                    }
                }
                await findByIdAndUpdate<ITask>(
                    referenceId,
                    {
                        index: referenceTask.index - 1
                    },
                    ETableName.TASK
                );
                await findByIdAndUpdate<ITask>(
                    fromId,
                    {
                        index: referenceTask.index
                    },
                    ETableName.TASK
                );
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
