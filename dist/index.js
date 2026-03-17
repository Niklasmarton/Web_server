import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { errorHandler, middlewareLogResponses } from "./api/middleware.js";
import { middlewareMetricsInc } from "./api/middleware.js";
import { handlerMetricsPrintOut } from "./api/metrics.js";
import { handlerMetricsReset } from "./api/reset.js";
import { chirphandler } from "./api/validate_chirp.js";
const app = express();
const PORT = 8080;
app.use(middlewareLogResponses);
app.use(express.json());
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/admin/healthz", (req, res, next) => {
    Promise.resolve(handlerReadiness(req, res)).catch(next);
});
app.get("/admin/metrics", (req, res, next) => {
    Promise.resolve(handlerMetricsPrintOut(req, res)).catch(next);
});
app.post("/admin/reset", (req, res, next) => {
    Promise.resolve(handlerMetricsReset(req, res)).catch(next);
});
app.post("/api/validate_chirp", (req, res, next) => {
    Promise.resolve(chirphandler(req, res)).catch(next);
});
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
