import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { BadRequestError, NotFoundError, UnauthorizedError, ForbiddenError } from "./errors.js";

export async function middlewareLogResponses(req: Request, res: Response, next: NextFunction): Promise<void> {
    res.on("finish", () => {
        const statusCode = res.statusCode;
        if (statusCode < 200 || statusCode >= 300) {
        console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`)
    }
    })
    next();
}

export async function middlewareMetricsInc(req: Request, res: Response, next: NextFunction): Promise<void> {
    config.api.fileServerHits += 1;
    next();
}

export async function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
    if (err instanceof BadRequestError) {
        res.status(400).json({ error: err.message})
    } else if (err instanceof UnauthorizedError) {
        res.status(401).json({ error: err.message})
    } else if (err instanceof ForbiddenError) {
       res.status(403).json({ error: err.message})
    } else if (err instanceof NotFoundError) {
        res.status(404).json({ error: err.message})
    }
    else {
        res.status(500).json({ error: "Something went wrong on our end" });
    }
}



