import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses } from "./api/middleware.js";
import { middlewareMetricsInc } from "./api/middleware.js";
import { handlerMetricsPrintOut } from "./api/metrics.js";
import { handlerMetricsReset } from "./api/reset.js";


const app = express();
const PORT = 8080;

app.use(middlewareLogResponses)

app.get("/healthz", handlerReadiness);

app.use("/app", middlewareMetricsInc);

app.get("/metrics", handlerMetricsPrintOut)

app.get("/reset", handlerMetricsReset)

app.use("/app", express.static("./src/app"));


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

