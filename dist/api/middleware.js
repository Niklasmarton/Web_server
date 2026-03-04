import { config } from "../config.js";
export async function middlewareLogResponses(req, res, next) {
    res.on("finish", () => {
        const statusCode = res.statusCode;
        if (statusCode < 200 || statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
        }
    });
    next();
}
export async function middlewareMetricsInc(req, res, next) {
    config.fileserverHits += 1;
    next();
}
