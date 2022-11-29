import { Request, Response } from "express";
import { TaskService } from "../services/task.service.js";

const create = async (req: Request, res: Response) => {
    return await TaskService.create(req.body, res);
};

const get = async (req: Request, res: Response) => {
    return await TaskService.get(req, res);
};

export const TaskController = { create, get };