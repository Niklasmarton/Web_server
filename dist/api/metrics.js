import { config } from "../config.js";
export function handlerMetricsPrintOut(req, res) {
    res.send(`Hits: ${config.fileserverHits}`);
}
