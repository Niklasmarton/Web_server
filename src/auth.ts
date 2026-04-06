import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { BadRequestError, NotFoundError, UnauthorizedError } from "./api/errors.js";
import { Request } from "express";
import crypto from "crypto";

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string> {
    const hash = await argon2.hash(password);
    return hash
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    if (await argon2.verify(hash, password)) {
        return true
    } else {
        return false
    }
};

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const initialized_at = Math.floor(Date.now() / 1000)
    const token = jwt.sign({
        iss: "chirpy",
        sub: userID,
        iat: initialized_at,
        exp: initialized_at + expiresIn
    }, secret)
    return token
}

export function validateJWT(tokenString: string, secret: string): string {
    let decoded: string | JwtPayload;
    try {
        decoded = jwt.verify(tokenString, secret) 
    } catch (err) {
        throw new UnauthorizedError("could not authenticate")
    }
    if (typeof decoded === "object" && decoded.sub ) {
        return decoded.sub
    }
    throw new UnauthorizedError("could not authenticate")
}

export function getBearerToken(req: Request): string {
    const auth_header = req.get("Authorization")
    if (!auth_header) {
    throw new UnauthorizedError("could not authenticate")
    }
    const parts = auth_header.split(" ")
    if (parts[0] !== "Bearer") {
        throw new BadRequestError("could not find token Bearer")
    }
    const token_string = parts[1].trim()
    return token_string
}

export function makeRefreshToken(): string {
    const refresh_token = crypto.randomBytes(32).toString("hex")
    return refresh_token
}

export function getApiKey(req: Request): string {
    const auth_header = req.get("Authorization")
    if (!auth_header) {
    throw new UnauthorizedError("could not authenticate")
    }
    const parts = auth_header.split(" ")
    if (parts[0] !== "ApiKey") {
        throw new BadRequestError("could not find token Bearer")
    }
    const api_key = parts[1].trim()
    return api_key
}



