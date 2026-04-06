import { BadRequestError } from "./errors.js";
import { createChirp } from "src/db/queries/chirps.js";
export async function chirpHandler(req, res) {
    const chirp = req.body;
    if (!req.body.body || !req.body.userId) {
        throw new BadRequestError("no body provided");
    }
    const profane = ["kerfuffle", "sharbert", "fornax"];
    if (chirp.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }
    for (const word of chirp.body.split(" ")) {
        if (profane.includes(word.toLowerCase())) {
            chirp.body = chirp.body.replace(word, "****");
        }
    }
    const new_chirp = await createChirp(chirp);
    if (!new_chirp) {
        throw new Error(`could not register chirp`);
    }
    res.status(201).json({
        id: new_chirp.id,
        createdAt: new_chirp.createdAt,
        updatedAt: new_chirp.updatedAt,
        body: new_chirp.body,
        userId: new_chirp.userId
    });
}
