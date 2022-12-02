import { KanbanService } from "../services/kanban.service.js";
import { Request, Response } from "express";

const get = async (req: Request, res: Response) => {
    return await KanbanService.get(req, res);
};

const create = async (req: Request, res: Response) => {
    return await KanbanService.create(req.body, res);
};

const reorder = async (req: Request, res: Response) => {
    return await KanbanService.reorder(req.body, res);
};

const remove = async (req: Request, res: Response) => {
    return await KanbanService.remove(req, res);
};
export const KanbanController = { get, create, reorder, remove };
