import { type Request, type Response } from "express";
import { ProjectService } from "../services/project.service.js";
import { StatusCodes } from "http-status-codes";

const create = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const result = await ProjectService.create(req.body);

    if (result != null) {
        return res.status(StatusCodes.CREATED).json(result);
    } else {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Manager not found" });
    }
};

const get = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const { projectName, managerId, projectId } = req.query;
    const result = await ProjectService.get(
        projectId as string | undefined,
        projectName as string | undefined,
        managerId as string | undefined
    );

    if (result != null) {
        return res.status(StatusCodes.OK).json(result);
    } else {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Project(s) not found" });
    }
};

const update = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const result = await ProjectService.update(req.body);

    if (result != null) {
        return res.status(StatusCodes.OK).json(result);
    } else {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Project not found" });
    }
};

const remove = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const { projectId } = req.query;
    const result = await ProjectService.remove(projectId as string);

    if (result === "Project deleted") {
        return res.status(StatusCodes.OK).json(result);
    } else if (result === "Project not found") {
        return res.status(StatusCodes.NOT_FOUND).json({ error: result });
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: result });
    }
};

export const ProjectController = { create, get, update, remove };
