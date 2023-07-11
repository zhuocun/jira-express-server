import { type Request, type Response } from "express";
import { TaskService } from "../services/task.service.js";
import { StatusCodes } from "http-status-codes";
import { getUserId } from "../utils/user.util.js";
import handleError from "../utils/error.util.js";

const create = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    try {
        const result = await TaskService.create(req.body);
        if (result != null) {
            return res.status(StatusCodes.CREATED).json(result);
        } else {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ error: "Lack of task information" });
        }
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: handleError(error, "Error creating task").message });
    }
};

const get = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    try {
        const { projectId } = req.query;
        const userId = getUserId(req);
        if (typeof projectId === "string" && userId != null) {
            const result = await TaskService.get(projectId, userId);
            if (Array.isArray(result)) {
                return res.status(StatusCodes.OK).json(result);
            } else {
                if (result === "Column not found") {
                    return res
                        .status(StatusCodes.NOT_FOUND)
                        .json({ error: result });
                } else {
                    return res
                        .status(StatusCodes.BAD_REQUEST)
                        .json({ error: result });
                }
            }
        } else {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ error: "Lack of project information" });
        }
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: handleError(error, "Error getting tasks").message });
    }
};

const update = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    try {
        const result = await TaskService.update(req.body);
        if (result != null) {
            return res.status(StatusCodes.OK).json(result);
        } else {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ error: "Task not found" });
        }
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: handleError(error, "Error updating task").message });
    }
};

const remove = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    try {
        const { taskId } = req.query;
        const result = await TaskService.remove(taskId as string);
        if (result === "Task deleted") {
            return res.status(StatusCodes.OK).json(result);
        } else if (result === "Task not found") {
            return res.status(StatusCodes.NOT_FOUND).json({ error: result });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: result });
        }
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: handleError(error, "Error deleting task").message });
    }
};

const reorder = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    try {
        const result = await TaskService.reorder(req.body);
        if (result != null) {
            return res.status(StatusCodes.OK).json(result);
        } else {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ error: "Bad request" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: handleError(error, "Error reordering task").message
        });
    }
};

export const TaskController = { create, get, update, remove, reorder };
