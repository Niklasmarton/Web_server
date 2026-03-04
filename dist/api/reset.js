import { config } from "../config.js";
export function handlerMetricsReset(req, res) {
    config.fileserverHits = 0;
    res.send("OK hits were reset");
}
