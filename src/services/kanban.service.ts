import { Request, Response } from "express";
import kanbanModel, { IKanbanModel } from "../models/kanban.model.js";
import StatusCode from "http-status-codes";
import { DocumentDefinition } from "mongoose";
import projectModel from "../models/project.model.js";

const get = async (req: Request, res: Response) => {
    const { projectId } = req.query;
    if (projectId) {
        const project = await projectModel.findById(projectId);
        if (project) {
            const kanbans = await kanbanModel.find({ projectId });
            if (!kanbans.length) {
                await kanbanModel.create({
                    kanbanName: "To Do",
                    projectId: projectId as string
                });
                await kanbanModel.create({
                    kanbanName: "In Progress",
                    projectId: projectId as string
                });
                await kanbanModel.create({
                    kanbanName: "Done",
                    projectId: projectId as string
                });
            }
            res.status(StatusCode.OK).json(
                await kanbanModel.find({ projectId })
            );
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
        await kanbanModel.create(reqBody);
        res.status(StatusCode.CREATED).json("Kanban created");
    } else {
        res.status(StatusCode.NOT_FOUND).json("Project not found");
    }
};

export const KanbanService = { get, create };
