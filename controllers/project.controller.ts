import { type Request, type Response } from "express";
import { ProjectService } from "../services/project.service.js";

const create = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    return await ProjectService.create(req.body, res);
};

const get = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    return await ProjectService.get(req, res);
};

const update = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    return await ProjectService.update(req.body, res);
};

const remove = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    return await ProjectService.remove(req, res);
};

export const ProjectController = { create, get, update, remove };
