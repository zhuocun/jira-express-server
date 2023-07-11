import { type Request, type Response } from "express";
import { ProjectService } from "../services/project.service.js";
import { StatusCodes } from "http-status-codes";
import handleError from "../utils/error.util.js";

const create = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    try {
        const result = await ProjectService.create(req.body);
        if (result != null) {
            return res.status(StatusCodes.CREATED).json(result);
        } else {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ error: "Manager not found" });
        }
    } catch (error) {
        return res.status(StatusCodes.NOT_FOUND).json({
            error: handleError(error, "Error creating project").message
        });
    }
};

const get = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    try {
        const { projectName, managerId, projectId } = req.query;
        const result = await ProjectService.get(
            projectId as string | undefined,
            projectName as string | undefined,
            managerId as string | undefined
        );
        if (result != null) {
            return res.status(StatusCodes.OK).json(result);
        } else {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ error: "Project(s) not found" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: handleError(error, "Error getting project(s)").message
        });
    }
};

const update = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    try {
        const result = await ProjectService.update(req.body);
        if (result != null) {
            return res.status(StatusCodes.OK).json(result);
        } else {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ error: "Project not found" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: handleError(error, "Error updating project").message
        });
    }
};

const remove = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    try {
        const { projectId } = req.query;
        const result = await ProjectService.remove(projectId as string);
        switch (result) {
            case "Project deleted":
                return res.status(StatusCodes.OK).json(result);
            case "Project not found":
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ error: result });
            default:
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ error: result });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: handleError(error, "Error deleting project").message
        });
    }
};

export const ProjectController = { create, get, update, remove };
