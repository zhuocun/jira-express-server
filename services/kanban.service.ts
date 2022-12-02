import { Request, Response } from "express";
import kanbanModel, { IKanbanModel } from "../models/kanban.model.js";
import StatusCode from "http-status-codes";
import { DocumentDefinition } from "mongoose";
import projectModel from "../models/project.model.js";
import { quickSort } from "../utils/array.util.js";
import IKanbanOrder from "../interfaces/kanbanOrder.js";

const get = async (req: Request, res: Response) => {
    const { projectId } = req.query;
    if (projectId) {
        const project = await projectModel.findById(projectId);
        if (project) {
            const kanbans = await kanbanModel.find({ projectId });
            if (!kanbans.length) {
                await kanbanModel.create({
                    kanbanName: "To Do",
                    projectId: projectId as string,
                    index: 0
                });
                await kanbanModel.create({
                    kanbanName: "In Progress",
                    projectId: projectId as string,
                    index: 1
                });
                await kanbanModel.create({
                    kanbanName: "Done",
                    projectId: projectId as string,
                    index: 2
                });
            }
            const r = await kanbanModel.find({ projectId });
            quickSort(r);
            res.status(StatusCode.OK).json(r);
        } else {
            res.status(StatusCode.NOT_FOUND).json("Project not found");
        }
    } else {
        res.status(StatusCode.NOT_FOUND).json("Kanban not found");
    }
};

const create = async (
    reqBody: DocumentDefinition<IKanbanModel>,
    res: Response
) => {
    const projectId = reqBody.projectId;
    const project = await projectModel.findById(projectId);
    if (project) {
        const index = (await kanbanModel.find({ projectId })).length;
        await kanbanModel.create({ ...reqBody, index });
        res.status(StatusCode.CREATED).json("Kanban created");
    } else {
        res.status(StatusCode.NOT_FOUND).json("Project not found");
    }
};

const reorder = async (
    reqBody: DocumentDefinition<IKanbanOrder>,
    res: Response
) => {
    const { type, fromId, referenceId } = reqBody;
    const fromKanban = await kanbanModel.findById(fromId);
    const referenceKanban = await kanbanModel.findById(referenceId);
    if (fromKanban && referenceKanban) {
        const kanbans = await kanbanModel.find({
            projectId: fromKanban.projectId
        });
        if (type === "before") {
            for (const k of kanbans) {
                if (
                    k.index > referenceKanban.index &&
                    k.index < fromKanban.index
                ) {
                    await kanbanModel.findByIdAndUpdate(k._id, {
                        index: k.index + 1
                    });
                }
            }
            await kanbanModel.findByIdAndUpdate(fromId, {
                index: referenceKanban.index
            });
            await kanbanModel.findByIdAndUpdate(referenceId, {
                index: referenceKanban.index + 1
            });
            res.status(StatusCode.OK).json("Kanban reordered");
        } else if (type === "after") {
            for (const k of kanbans) {
                if (
                    k.index > fromKanban.index &&
                    k.index < referenceKanban.index
                ) {
                    await kanbanModel.findByIdAndUpdate(k._id, {
                        index: k.index - 1
                    });
                }
            }
            await kanbanModel.findByIdAndUpdate(referenceId, {
                index: referenceKanban.index - 1
            });
            await kanbanModel.findByIdAndUpdate(fromId, {
                index: referenceKanban.index
            });
            res.status(StatusCode.OK).json("Kanban reordered");
        }
    } else {
        res.status(StatusCode.NOT_FOUND).json("Kanban not found");
    }
};

const remove = async (req: Request, res: Response) => {
    const { kanbanId } = req.query;
    const kanban = await kanbanModel.findById(kanbanId);
    if (kanban) {
        await kanbanModel.findByIdAndDelete(kanbanId);
        res.status(StatusCode.OK).json("Kanban deleted");
    } else {
        res.status(StatusCode.NOT_FOUND).json("Kanban not found");
    }
};

export const KanbanService = { get, create, reorder, remove };
