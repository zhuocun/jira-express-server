import type ITaskOrder from "../interfaces/taskOrder.js";
import { quickSort } from "../utils/array.util.js";
import findById from "../database/CRUD/findById.js";
import ETableName from "../constants/eTableName.js";
import find from "../database/CRUD/find.js";
import createItem from "../database/CRUD/create.js";
import findByIdAndUpdate from "../database/CRUD/findByIdAndUpdate.js";
import ITask from "../interfaces/task.js";
import IColumn from "../interfaces/column.js";
import IUser from "../interfaces/user.js";
import IProject from "../interfaces/project.js";
import findByIdAndDelete from "../database/CRUD/findByIdAndDelete.js";

const create = async (reqBody: ITask): Promise<string | null> => {
    const { columnId, coordinatorId, projectId } = reqBody;
    const column = await findById<IColumn>(columnId, ETableName.COLUMN);
    const coordinator = await findById<IUser>(coordinatorId, ETableName.USER);
    const project = await findById<IProject>(projectId, ETableName.PROJECT);
    if (column != null && coordinator != null && project != null) {
        const tasks = await find<ITask>({ columnId }, ETableName.TASK);
        await createItem(
            { ...reqBody, index: tasks?.length != null ? tasks.length : 0 },
            ETableName.TASK
        );
        return "Task created";
    } else {
        return null;
    }
};

const get = async (
    projectId: string,
    userId: string
): Promise<
| Array<
ITask & {
    _id: string
}
>
| string
| undefined
> => {
    const columns = await find<IColumn>({ projectId }, ETableName.COLUMN);
    if (columns != null) {
        for (const c of columns) {
            const allTasks = await find<ITask>({ projectId }, ETableName.TASK);
            if (allTasks == null) {
                if (c.columnName === "To Do") {
                    await createItem(
                        {
                            columnId: c._id,
                            projectId,
                            taskName: "Default Task",
                            coordinatorId: userId,
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
        return tasks;
    } else {
        return "Column not found";
    }
};

const update = async (
    reqBody: ITask & { _id: string }
): Promise<string | null> => {
    const taskId = reqBody._id;
    const task = await findById<ITask>(taskId, ETableName.TASK);
    if (task != null) {
        await findByIdAndUpdate<ITask>(taskId, reqBody, ETableName.TASK);
        return "Task updated";
    } else {
        return null;
    }
};

const remove = async (taskId: string): Promise<string | null> => {
    if (taskId != null && typeof taskId === "string") {
        const task = await findById<ITask>(taskId, ETableName.TASK);
        if (task != null) {
            await findByIdAndDelete<ITask>(taskId, ETableName.TASK);
            return "Task deleted";
        } else {
            return null;
        }
    } else {
        return "Bad request";
    }
};

export const reorder = async (
    reqBody: ITaskOrder
): Promise<string | null | undefined> => {
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

        if (fromColumnId !== referenceColumnId && fromColumnTasks != null) {
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
                if (referenceColumnTasks != null) {
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
                }
                await findByIdAndUpdate<ITask>(
                    fromId,
                    {
                        columnId: referenceColumnId,
                        index: referenceTask.index
                    },
                    ETableName.TASK
                );
                return "Task reordered";
            } else {
                await findByIdAndUpdate<ITask>(
                    fromId,
                    {
                        columnId: referenceColumnId,
                        index:
                            referenceColumnTasks?.length != null
                                ? referenceColumnTasks?.length
                                : 0
                    },
                    ETableName.TASK
                );
                return "Task reordered";
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
                return "Task reordered";
            } else if (type === "after") {
                for (const t of referenceColumnTasks) {
                    if (
                        t.index > fromTask.index &&
                        t.index < referenceTask.index
                    ) {
                        await findByIdAndUpdate(
                            t._id,
                            { index: t.index - 1 },
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
                return "Task reordered";
            }
        }
    } else {
        return null;
    }
};

export const TaskService = { create, get, update, remove, reorder };
