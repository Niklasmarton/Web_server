import { Request, Response } from "express";
import { getBearerToken, makeJWT } from "../auth.js";
import { NotFoundError, UnauthorizedError } from "./errors.js";
import { getUserFromRefreshKey } from "../db/queries/refresh.js";
import { config } from "../config.js"

export async function handlerRefreshToken(req: Request, res: Response) {
    const refresh_key = getBearerToken(req)
    const refresh_token_obj = await getUserFromRefreshKey(refresh_key)

    const current_time = new Date();

    if (!refresh_token_obj || refresh_token_obj.revokedAt !== null || current_time > refresh_token_obj.expiresAt) {
        throw new UnauthorizedError("refresh token expired")
    }

    const token = makeJWT(refresh_token_obj.userId, 3600, config.api.jwtSecret)

    res.status(200).json({
        token: token,
    })

}