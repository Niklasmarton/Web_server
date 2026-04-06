import { config } from "../config.js";
import { Request, Response } from "express";

export function handlerMetricsPrintOut(req: Request, res: Response): void {
    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.api.fileServerHits} times!</p>
  </body>
</html>`)
}