import { type Request, type Response } from "express";
import { TaskService } from "../services/task.service.js";
import { StatusCodes } from "http-status-codes";
import { getUserId } from "../utils/user.util.js";

const create = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const result = await TaskService.create(req.body);

    if (result != null) {
        return res.status(StatusCodes.CREATED).json(result);
    } else {
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: "Lack of task information" });
    }
};

const get = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const { projectId } = req.query;
    const userId = getUserId(req);

    if (typeof projectId === "string" && userId != null) {
        const result = await TaskService.get(projectId, userId);

        if (Array.isArray(result)) {
            return res.status(StatusCodes.OK).json(result);
        } else {
            if (result === "Column not found") {
                return res.status(StatusCodes.NOT_FOUND).json({ error: result });
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: result });
            }
        }
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Bad request" });
    }
};

const update = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const result = await TaskService.update(req.body);

    if (result != null) {
        return res.status(StatusCodes.OK).json(result);
    } else {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Task not found" });
    }
};

const remove = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const { taskId } = req.query;
    const result = await TaskService.remove(taskId as string);

    if (result === "Task deleted") {
        return res.status(StatusCodes.OK).json(result);
    } else if (result === "Task not found") {
        return res.status(StatusCodes.NOT_FOUND).json({ error: result });
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: result });
    }
};

const reorder = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const result = await TaskService.reorder(req.body);

    if (result != null) {
        return res.status(StatusCodes.OK).json(result);
    } else {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: "Bad request" });
    }
};

export const TaskController = { create, get, update, remove, reorder };
