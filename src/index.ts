import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import {  errorHandler, middlewareLogResponses } from "./api/middleware.js";
import { middlewareMetricsInc } from "./api/middleware.js";
import { handlerMetricsPrintOut } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { chirpHandler, getChirpsHandler, getSingleChirpHandler, handlerDeleteChirp } from "./api/chirps.js";
import { handlerUsersCreate, handlerUsersUpdate } from "./api/users.js";
import { authenticateUser } from "./api/login.js";
import { handlerRefreshToken } from "./api/refresh.js";
import { revokeRefreshToken } from "./api/revoke.js";
import { handlerUpgradeUserChirpyRed } from "./api/webhooks.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses)

app.use(express.json())

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/admin/healthz", (req, res, next) => {
  Promise.resolve(handlerReadiness(req, res)).catch(next);
});

app.get("/admin/metrics", (req, res, next) => {
  Promise.resolve(handlerMetricsPrintOut(req, res)).catch(next)
});

app.post("/admin/reset", (req, res, next) => {
  Promise.resolve(handlerReset(req, res)).catch(next)
});
app.post("/api/chirps", (req, res, next) => {
  Promise.resolve(chirpHandler(req, res)).catch(next) 
});
app.get("/api/chirps", (req, res, next) => {
  Promise.resolve(getChirpsHandler(req, res)).catch(next) 
});
app.get("/api/chirps/:chirpId", (req, res, next) => {
  Promise.resolve(getSingleChirpHandler(req, res)).catch(next) 
});
app.post("/api/users", (req, res, next) => {
  Promise.resolve(handlerUsersCreate(req, res)).catch(next) 
});
app.post("/api/login", (req, res, next) => {
  Promise.resolve(authenticateUser(req, res)).catch(next) 
});
app.post("/api/refresh", (req, res, next) => {
  Promise.resolve(handlerRefreshToken(req, res)).catch(next) 
});
app.post("/api/revoke", (req, res, next) => {
  Promise.resolve(revokeRefreshToken(req, res)).catch(next) 
});
app.put("/api/users", (req, res, next) => {
  Promise.resolve(handlerUsersUpdate(req, res)).catch(next) 
});
app.delete("/api/chirps/:chirpId", (req, res, next) => {
  Promise.resolve(handlerDeleteChirp(req, res)).catch(next) 
});
app.post("/api/polka/webhooks", (req, res, next) => {
  Promise.resolve(handlerUpgradeUserChirpyRed(req, res)).catch(next) 
});

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

