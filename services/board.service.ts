import { type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";
import { quickSort } from "../utils/array.util.js";
import type IColumnOrder from "../interfaces/columnOrder.js";
import findById from "../utils/databaseUtils/findById.js";
import ETableName from "../constants/eTableName.js";
import IProject from "../interfaces/project.js";
import find from "../utils/databaseUtils/find.js";
import IColumn from "../interfaces/column.js";
import createItem from "../utils/databaseUtils/create.js";
import findByIdAndUpdate from "../utils/databaseUtils/findByIdAndUpdate.js";
import findByIdAndDelete from "../utils/databaseUtils/findByIdAndDelete.js";

const get = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const { projectId } = req.query;
    if (projectId != null && typeof projectId === "string") {
        const project = await findById<IProject>(projectId, ETableName.PROJECT);
        if (project != null) {
            const columns = await find<IColumn>(
                { projectId },
                ETableName.COLUMN
            );
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
            const resColumns = await find<IColumn>(
                { projectId },
                ETableName.COLUMN
            );
            if (resColumns != null) {
                quickSort(resColumns);
                return res.status(StatusCodes.OK).json(resColumns);
            } else {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json("Columns not found");
            }
        } else {
            return res.status(StatusCodes.NOT_FOUND).json("Project not found");
        }
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json("Bad request");
    }
};

const create = async (
    reqBody: IColumn,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const projectId = reqBody.projectId;
    const project = await findById<IProject>(projectId, ETableName.PROJECT);
    if (project != null) {
        const columns = await find<IColumn>({ projectId }, ETableName.COLUMN);
        if (columns != null) {
            await createItem<IColumn>(
                { ...reqBody, index: columns.length },
                ETableName.COLUMN
            );
            return res.status(StatusCodes.CREATED).json("Column created");
        } else {
            return res.status(StatusCodes.NOT_FOUND).json("Columns not found");
        }
    } else {
        return res.status(StatusCodes.NOT_FOUND).json("Project not found");
    }
};

const reorder = async (
    reqBody: IColumnOrder,
    res: Response
): Promise<Response<any, Record<string, any>> | undefined> => {
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
                return res.status(StatusCodes.OK).json("Column reordered");
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
                return res.status(StatusCodes.OK).json("Column reordered");
            }
        } else {
            return res.status(StatusCodes.NOT_FOUND).json("Column not found");
        }
    } else {
        return res.status(StatusCodes.NOT_FOUND).json("Column not found");
    }
};

const remove = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const { columnId } = req.query;
    if (columnId != null && typeof columnId === "string") {
        const column = await findById<IColumn>(columnId, ETableName.COLUMN);
        if (column != null) {
            await findByIdAndDelete<IColumn>(columnId, ETableName.COLUMN);
            return res.status(StatusCodes.OK).json("Column deleted");
        } else {
            return res.status(StatusCodes.NOT_FOUND).json("Column not found");
        }
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json("Bad request");
    }
};

export const BoardService = { get, create, reorder, remove };
