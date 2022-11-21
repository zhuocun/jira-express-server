import { Request, Response } from "express";
import { ProjectService } from "../services/project.service.js";

const create = async (req: Request, res: Response) => {
    return await ProjectService.create(req.body, res);
};

const get = async (req: Request, res: Response) => {
    return await ProjectService.get(res);
};

export const ProjectController = { create, get };
