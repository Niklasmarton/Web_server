import { Request, Response } from "express";
import { updateToChirpyRed } from "../db/queries/chirpy_red.js";
import { config } from "../config.js";
import { getApiKey } from "../auth.js";

export async function handlerUpgradeUserChirpyRed( req: Request, res: Response): Promise<void> {
    type ReqBody = {
        event: string,
        data: {
            userId: string
        }
    }

    const api_key = getApiKey(req)
    if (api_key !== config.api.polkakey) {
        res.status(401).send()
    }

    const request: ReqBody = req.body;

    if (request.event !== "user.upgraded") {
        res.status(204).send()
        return;
    }

    const user = await updateToChirpyRed(request.data.userId)

    if (!user) {
        res.status(404).send()
        return;
    }

    res.status(204).send()

}