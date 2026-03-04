import { config } from "../config.js";
import { Request, Response } from "express";

export function handlerMetricsReset(req: Request, res: Response): void {
    config.fileserverHits = 0
    res.send("OK hits were reset")
}