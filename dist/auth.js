import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { BadRequestError, UnauthorizedError } from "./api/errors.js";
import crypto from "crypto";
export async function hashPassword(password) {
    const hash = await argon2.hash(password);
    return hash;
}
export async function checkPasswordHash(password, hash) {
    if (await argon2.verify(hash, password)) {
        return true;
    }
    else {
        return false;
    }
}
;
export function makeJWT(userID, expiresIn, secret) {
    const initialized_at = Math.floor(Date.now() / 1000);
    const token = jwt.sign({
        iss: "chirpy",
        sub: userID,
        iat: initialized_at,
        exp: initialized_at + expiresIn
    }, secret);
    return token;
}
export function validateJWT(tokenString, secret) {
    let decoded;
    try {
        decoded = jwt.verify(tokenString, secret);
    }
    catch (err) {
        throw new UnauthorizedError("could not authenticate");
    }
    if (typeof decoded === "object" && decoded.sub) {
        return decoded.sub;
    }
    throw new UnauthorizedError("could not authenticate");
}
export function getBearerToken(req) {
    const auth_header = req.get("Authorization");
    if (!auth_header) {
        throw new UnauthorizedError("could not authenticate");
    }
    const parts = auth_header.split(" ");
    if (parts[0] !== "Bearer") {
        throw new BadRequestError("could not find token Bearer");
    }
    const token_string = parts[1].trim();
    return token_string;
}
export function makeRefreshToken() {
    const refresh_token = crypto.randomBytes(32).toString("hex");
    return refresh_token;
}
export function getApiKey(req) {
    const auth_header = req.get("Authorization");
    if (!auth_header) {
        throw new UnauthorizedError("could not authenticate");
    }
    const parts = auth_header.split(" ");
    if (parts[0] !== "ApiKey") {
        throw new BadRequestError("could not find token Bearer");
    }
    const api_key = parts[1].trim();
    return api_key;
}
