import { KanbanService } from "../services/kanban.service.js";
import { Request, Response } from "express";

const get = async (req: Request, res: Response) => {
    return await KanbanService.get(req, res);
};

const create = async (req: Request, res: Response) => {
    return await KanbanService.create(req.body, res);
};

export const KanbanController = { get, create };
