import { config } from "../config.js";
import { Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "./errors.js";
import { deleteUsers } from "../db/queries/users.js";

export async function handlerReset(req: Request, res: Response): Promise<void> {
    if (config.api.platform !== "dev") {
        throw new ForbiddenError(`Forbidden`)
    }
    await deleteUsers(); 
    config.api.fileServerHits = 0
    res.send("OK hits were reset")
}