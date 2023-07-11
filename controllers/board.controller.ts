import { StatusCodes } from "http-status-codes";
import { BoardService } from "../services/board.service.js";
import { type Request, type Response } from "express";
import handleError from "../utils/error.util.js";

const get = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    try {
        const { projectId } = req.query;
        if (projectId != null && typeof projectId === "string") {
            const columns = await BoardService.get(projectId);

            if (columns != null) {
                return res.status(StatusCodes.OK).json(columns);
            } else {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ error: "Columns not found" });
            }
        } else {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ error: "Bad request" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: handleError(error, "Error getting columns").message
        });
    }
};

const create = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    try {
        const result = await BoardService.create(req.body);
        if (result != null) {
            return res.status(StatusCodes.CREATED).json(result);
        } else {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ error: "Project not found" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: handleError(error, "Error creating column").message
        });
    }
};

const reorder = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    try {
        const result = await BoardService.reorder(req.body);
        if (result != null) {
            return res.status(StatusCodes.OK).json(result);
        } else {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ error: "Column not found" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: handleError(error, "Error reordering columns").message
        });
    }
};

const remove = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    try {
        const { columnId } = req.query;
        if (columnId != null && typeof columnId === "string") {
            const result = await BoardService.remove(columnId);
            if (result != null) {
                return res.status(StatusCodes.OK).json(result);
            } else {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ error: "Column not found" });
            }
        } else {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ error: "Bad request" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: handleError(error, "Error deleting column").message
        });
    }
};

export const BoardController = { get, create, reorder, remove };
