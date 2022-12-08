import { Request, Response } from "express";
import columnModel, { IColumnModel } from "../models/column.model.js";
import StatusCode from "http-status-codes";
import { DocumentDefinition } from "mongoose";
import projectModel from "../models/project.model.js";
import { quickSort } from "../utils/array.util.js";
import IColumnOrder from "../interfaces/columnOrder.js";

const get = async (req: Request, res: Response) => {
    const { projectId } = req.query;
    if (projectId) {
        const project = await projectModel.findById(projectId);
        if (project) {
            const columns = await columnModel.find({ projectId });
            if (!columns.length) {
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
            res.status(StatusCode.OK).json(resColumns);
        } else {
            res.status(StatusCode.NOT_FOUND).json("Project not found");
        }
    } else {
        res.status(StatusCode.NOT_FOUND).json("Column not found");
    }
};

const create = async (
    reqBody: DocumentDefinition<IColumnModel>,
    res: Response
) => {
    const projectId = reqBody.projectId;
    const project = await projectModel.findById(projectId);
    if (project) {
        const index = (await columnModel.find({ projectId })).length;
        await columnModel.create({ ...reqBody, index });
        res.status(StatusCode.CREATED).json("Column created");
    } else {
        res.status(StatusCode.NOT_FOUND).json("Project not found");
    }
};

const reorder = async (
    reqBody: DocumentDefinition<IColumnOrder>,
    res: Response
) => {
    const { type, fromId, referenceId } = reqBody;
    const fromColumn = await columnModel.findById(fromId);
    const referenceColumn = await columnModel.findById(referenceId);
    if (fromColumn && referenceColumn) {
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
            res.status(StatusCode.OK).json("Column reordered");
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
            res.status(StatusCode.OK).json("Column reordered");
        }
    } else {
        res.status(StatusCode.NOT_FOUND).json("Column not found");
    }
};

const remove = async (req: Request, res: Response) => {
    const { columnId } = req.query;
    const column = await columnModel.findById(columnId);
    if (column) {
        await columnModel.findByIdAndDelete(columnId);
        res.status(StatusCode.OK).json("Column deleted");
    } else {
        res.status(StatusCode.NOT_FOUND).json("Column not found");
    }
};

export const BoardService = { get, create, reorder, remove };
