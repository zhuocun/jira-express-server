import { quickSort } from "../utils/array.util.js";
import type IColumnOrder from "../interfaces/columnOrder.js";
import findById from "../database/CRUD/findById.js";
import ETableName from "../constants/eTableName.js";
import IProject from "../interfaces/project.js";
import find from "../database/CRUD/find.js";
import IColumn from "../interfaces/column.js";
import createItem from "../database/CRUD/create.js";
import findByIdAndUpdate from "../database/CRUD/findByIdAndUpdate.js";
import findByIdAndDelete from "../database/CRUD/findByIdAndDelete.js";

const get = async (projectId: string): Promise<IColumn[] | null> => {
    const project = await findById<IProject>(projectId, ETableName.PROJECT);

    if (project != null) {
        let columns = await find<IColumn>({ projectId }, ETableName.COLUMN);

        if (columns == null) {
            await createItem<IColumn>(
                {
                    columnName: "To Do",
                    projectId,
                    index: 0
                },
                ETableName.COLUMN
            );
            await createItem<IColumn>(
                {
                    columnName: "In Progress",
                    projectId,
                    index: 1
                },
                ETableName.COLUMN
            );
            await createItem<IColumn>(
                {
                    columnName: "Done",
                    projectId,
                    index: 2
                },
                ETableName.COLUMN
            );
        }

        columns = await find<IColumn>({ projectId }, ETableName.COLUMN);

        if (columns != null) {
            quickSort(columns);
            return columns;
        }
    }
    return null;
};

const create = async (reqBody: IColumn): Promise<string | null> => {
    const projectId = reqBody.projectId;
    const project = await findById<IProject>(projectId, ETableName.PROJECT);

    if (project != null) {
        const columns = await find<IColumn>({ projectId }, ETableName.COLUMN);
        if (columns != null) {
            await createItem<IColumn>(
                { ...reqBody, index: columns.length },
                ETableName.COLUMN
            );
            return "Column created";
        }
    }
    return null;
};

const reorder = async (reqBody: IColumnOrder): Promise<string | null> => {
    const { type, fromId, referenceId } = reqBody;
    const fromColumn = await findById<IColumn>(fromId, ETableName.COLUMN);
    const referenceColumn = await findById<IColumn>(
        referenceId,
        ETableName.COLUMN
    );

    if (fromColumn != null && referenceColumn != null) {
        const columns = await find<IColumn>(
            {
                projectId: fromColumn.projectId
            },
            ETableName.COLUMN
        );

        if (columns != null) {
            if (type === "before") {
                for (const k of columns) {
                    if (
                        k.index > referenceColumn.index &&
                        k.index < fromColumn.index
                    ) {
                        await findByIdAndUpdate<IColumn>(
                            k._id,
                            {
                                index: k.index + 1
                            },
                            ETableName.COLUMN
                        );
                    }
                }
                await findByIdAndUpdate<IColumn>(
                    fromId,
                    {
                        index: referenceColumn.index
                    },
                    ETableName.COLUMN
                );
                await findByIdAndUpdate<IColumn>(
                    referenceId,
                    {
                        index: referenceColumn.index + 1
                    },
                    ETableName.COLUMN
                );
                return "Column reordered";
            } else if (type === "after") {
                for (const k of columns) {
                    if (
                        k.index > fromColumn.index &&
                        k.index < referenceColumn.index
                    ) {
                        await findByIdAndUpdate<IColumn>(
                            k._id,
                            {
                                index: k.index - 1
                            },
                            ETableName.COLUMN
                        );
                    }
                }
                await findByIdAndUpdate<IColumn>(
                    referenceId,
                    {
                        index: referenceColumn.index - 1
                    },
                    ETableName.COLUMN
                );
                await findByIdAndUpdate<IColumn>(
                    fromId,
                    {
                        index: referenceColumn.index
                    },
                    ETableName.COLUMN
                );
                return "Column reordered";
            }
        }
    }
    return null;
};

const remove = async (columnId: string): Promise<string | null> => {
    const column = await findById<IColumn>(columnId, ETableName.COLUMN);

    if (column != null) {
        await findByIdAndDelete<IColumn>(columnId, ETableName.COLUMN);
        return "Column deleted";
    }

    return null;
};

export const BoardService = { get, create, reorder, remove };
