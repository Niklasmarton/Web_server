import { Request, Response } from "express";
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "./errors.js";
import { createChirp, deleteChirp, getChirps, getSingleChirp } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

export async function chirpHandler(req: Request, res: Response): Promise<void> {
    type parameters= {
    body: string;
    }

    const token = getBearerToken(req)
    const userId = validateJWT(token, config.api.jwtSecret)



    const chirp: parameters = req.body;
        if (!req.body.body) {
        throw new BadRequestError("no body provided")
    }

    const profane = ["kerfuffle", "sharbert", "fornax"]

    if (chirp.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }

    for (const word of chirp.body.split(" ")) {
        if (profane.includes(word.toLowerCase())) {
            chirp.body = chirp.body.replace(word, "****")
        }
    }
    const new_chirp = await createChirp({body: chirp.body, userId})
        if (!new_chirp) {
    throw new Error(`could not register chirp`)
        }
    res.status(201).json({
    id: new_chirp.id,
    createdAt: new_chirp.createdAt,
    updatedAt: new_chirp.updatedAt,
    body: new_chirp.body,
    userId: new_chirp.userId
    })
}

export async function getChirpsHandler(req: Request, res: Response): Promise<void> {
    let authorId = "";
    let authorIdQuery = req.query.authorId;
    if (typeof authorIdQuery === "string") {
        authorId = authorIdQuery;
    }

    let sort = "";
    let sort_query = req.query.sort;
    if (typeof sort_query === "string") {
        sort = sort_query;
    }

    const chirps = await getChirps(authorId, sort)
    if (!chirps) {
        throw new NotFoundError("db is empty")
    }
    res.status(200).json(chirps)
}

export async function getSingleChirpHandler(req: Request, res: Response): Promise<void> {
    const { chirpId } = req.params
    if (typeof chirpId !== "string") {
        res.status(404).send()
        return
    }
    const chirp = await getSingleChirp(chirpId)
    if (!chirp) {
        res.status(404).send()
        return
    }
    res.status(200).json(chirp)
}

export async function handlerDeleteChirp(req: Request, res: Response): Promise<void>  {
    let access_token: string;
    let userId: string;

    try {
        access_token = getBearerToken(req)
        userId = validateJWT(access_token, config.api.jwtSecret)
    } catch (err) {
        throw new UnauthorizedError("no access")
    }

    const { chirpId } = req.params 
    if (typeof chirpId !== "string") {
        res.status(404)
        return
    }
    const chirp = await getSingleChirp(chirpId)
    if (!chirp) {
        res.status(404)
        return
    }
    if (userId !== chirp.userId) {
        throw new ForbiddenError("not author of given chirp")
    }

    const deleted_chirp = await deleteChirp(chirpId)

    if (!deleted_chirp) {
        throw new BadRequestError("could not delete chirp")
    }
    res.status(204).send()
}
