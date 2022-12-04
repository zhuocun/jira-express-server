import { BoardService } from "../services/board.service.js";
import { Request, Response } from "express";

const get = async (req: Request, res: Response) => {
    return await BoardService.get(req, res);
};

const create = async (req: Request, res: Response) => {
    return await BoardService.create(req.body, res);
};

const reorder = async (req: Request, res: Response) => {
    return await BoardService.reorder(req.body, res);
};

const remove = async (req: Request, res: Response) => {
    return await BoardService.remove(req, res);
};

export const BoardController = { get, create, reorder, remove };
