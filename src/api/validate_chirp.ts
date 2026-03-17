import { Request, Response } from "express";
import { BadRequestError } from "./errors.js";

export async function chirphandler(req: Request, res: Response) {
    type parameters= {
    body: string;
}

  // With express.json() middleware, req.body is already parsed!
    const params: parameters = req.body;
    const profane = ["kerfuffle", "sharbert", "fornax"]

    if (params.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    } else {
        for (const word of params.body.split(" ")) {
            if (profane.includes(word.toLowerCase())) {
                params.body = params.body.replace(word, "****")
            }
        }
        res.status(200).json({"cleanedBody": params.body})     
    }
}