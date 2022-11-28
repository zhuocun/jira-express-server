import { Request, Response } from "express";
import kanbanModel, { IKanbanModel } from "../models/kanban.model.js";
import StatusCode from "http-status-codes";
import { DocumentDefinition } from "mongoose";
import projectModel from "../models/project.model.js";

const get = async (req: Request, res: Response) => {
    const { projectId } = req.query;
    if (projectId) {
        const kanban = await kanbanModel.findOne({ projectId });
        res.status(StatusCode.OK).json(kanban);
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
