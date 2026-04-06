import { Request, Response } from "express";
import { createUser, updateUserPassword } from "../db/queries/users.js";
import { BadRequestError, UnauthorizedError } from "./errors.js";
import { getBearerToken, hashPassword } from "../auth.js";
import { validateJWT } from "../auth.js";
import { config } from "../config.js";

export async function handlerUsersCreate(req: Request, res: Response): Promise<void> {
    type param = {
        hashedPassword: string
        email: string
    }
    if (!req.body.email || !req.body.password) {
        throw new BadRequestError("no email or password provided")
    }
    const hashed_password = await hashPassword(req.body.password);

    const user: param = {
        hashedPassword: hashed_password,
        email: req.body.email,
    }
    const new_user = await createUser(user)
    if (!new_user) {
        throw new Error(`could not create user`)
    }
    res.status(201).json({
        id: new_user.id,
        createdAt: new_user.createdAt,
        updatedAt: new_user.updatedAt,
        email: new_user.email,
        isChirpyRed: new_user.isChirpyRed
})

}

export async function handlerUsersUpdate(req: Request, res: Response): Promise<void> {

    let access_token: string;
    let userId: string;
    if (!req.body.password || !req.body.email) {
        throw new BadRequestError("missing password or email in body")
    }

    try {
        access_token = getBearerToken(req)
        userId = validateJWT(access_token, config.api.jwtSecret)
    } catch (err) {
        throw new UnauthorizedError("could not validate")
    }

    const password = req.body.password

    const hashed_password = await hashPassword(password)

    const new_user = await updateUserPassword(userId, hashed_password, req.body.email)

    if (!new_user) {
        throw new UnauthorizedError("could not update password/email")
    }

    res.status(200).json({
        id: new_user.id,
        createdAt: new_user.createdAt,
        updatedAt: new_user.updatedAt,
        email: new_user.email,
        isChirpyRed: new_user.isChirpyRed
    })

}