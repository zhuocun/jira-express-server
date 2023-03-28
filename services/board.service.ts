import { type Request, type Response } from "express";
import columnModel, { type IColumnModel } from "../models/column.model.js";
import { StatusCodes } from "http-status-codes";
import { type DocumentDefinition } from "mongoose";
import projectModel from "../models/project.model.js";
import { quickSort } from "../utils/array.util.js";
import type IColumnOrder from "../interfaces/columnOrder.js";

const get = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const { projectId } = req.query;
    if (projectId != null) {
        const project = await projectModel.findById(projectId);
        if (project != null) {
            const columns = await columnModel.find({ projectId });
            if (columns.length === 0) {
                await columnModel.create({
                    columnName: "To Do",
                    projectId: projectId as string,
                    index: 0
                });
                await columnModel.create({
                    columnName: "In Progress",
                    projectId: projectId as string,
                    index: 1
                });
                await columnModel.create({
                    columnName: "Done",
                    projectId: projectId as string,
                    index: 2
                });
            }
            const resColumns = await columnModel.find({ projectId });
            quickSort(resColumns);
            return res.status(StatusCodes.OK).json(resColumns);
        } else {
            return res.status(StatusCodes.NOT_FOUND).json("Project not found");
        }
    } else {
        return res.status(StatusCodes.NOT_FOUND).json("Column not found");
    }
};

const create = async (
    reqBody: DocumentDefinition<IColumnModel>,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const projectId = reqBody.projectId;
    const project = await projectModel.findById(projectId);
    if (project != null) {
        const index = (await columnModel.find({ projectId })).length;
        await columnModel.create({ ...reqBody, index });
        return res.status(StatusCodes.CREATED).json("Column created");
    } else {
        return res.status(StatusCodes.NOT_FOUND).json("Project not found");
    }
};

const reorder = async (
    reqBody: DocumentDefinition<IColumnOrder>,
    res: Response
): Promise<Response<any, Record<string, any>> | undefined> => {
    const { type, fromId, referenceId } = reqBody;
    const fromColumn = await columnModel.findById(fromId);
    const referenceColumn = await columnModel.findById(referenceId);
    if (fromColumn != null && referenceColumn != null) {
        const columns = await columnModel.find({
            projectId: fromColumn.projectId
        });
        if (type === "before") {
            for (const k of columns) {
                if (
                    k.index > referenceColumn.index &&
                    k.index < fromColumn.index
                ) {
                    await columnModel.findByIdAndUpdate(k._id, {
                        index: k.index + 1
                    });
                }
            }
            await columnModel.findByIdAndUpdate(fromId, {
                index: referenceColumn.index
            });
            await columnModel.findByIdAndUpdate(referenceId, {
                index: referenceColumn.index + 1
            });
            return res.status(StatusCodes.OK).json("Column reordered");
        } else if (type === "after") {
            for (const k of columns) {
                if (
                    k.index > fromColumn.index &&
                    k.index < referenceColumn.index
                ) {
                    await columnModel.findByIdAndUpdate(k._id, {
                        index: k.index - 1
                    });
                }
            }
            await columnModel.findByIdAndUpdate(referenceId, {
                index: referenceColumn.index - 1
            });
            await columnModel.findByIdAndUpdate(fromId, {
                index: referenceColumn.index
            });
            return res.status(StatusCodes.OK).json("Column reordered");
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
    const column = await columnModel.findById(columnId);
    if (column != null) {
        await columnModel.findByIdAndDelete(columnId);
        return res.status(StatusCodes.OK).json("Column deleted");
    } else {
        return res.status(StatusCodes.NOT_FOUND).json("Column not found");
    }
};

export const BoardService = { get, create, reorder, remove };
