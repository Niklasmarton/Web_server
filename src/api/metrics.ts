import { config } from "../config.js";
import { Request, Response } from "express";

export function handlerMetricsPrintOut(req: Request, res: Response): void {
    res.send(`Hits: ${config.fileserverHits}`)
}