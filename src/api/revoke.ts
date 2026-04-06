import { Request, Response } from "express";
import { getBearerToken, makeJWT } from "../auth.js";
import { UnauthorizedError } from "./errors.js";
import { getUserFromRefreshKey, revokeRefreshKey } from "../db/queries/refresh.js";

export async function revokeRefreshToken(req: Request, res: Response) {
    const refresh_key = getBearerToken(req)
    const refresh_token_obj = await getUserFromRefreshKey(refresh_key)
    
    if (!refresh_token_obj) {
        throw new UnauthorizedError("could not find refresh key")
    }

    await revokeRefreshKey(refresh_token_obj.token)

    res.status(204).send()

}