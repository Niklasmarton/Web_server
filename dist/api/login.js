import { checkPasswordHash, makeJWT, makeRefreshToken } from "../auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import { UnauthorizedError } from "./errors.js";
import { config } from "../config.js";
import { createRefreshKey } from "../db/queries/refresh.js";
export async function authenticateUser(req, res) {
    const params = req.body;
    const user = await getUserByEmail(params.email);
    if (!user) {
        throw new UnauthorizedError("Unauthorized");
    }
    if (await checkPasswordHash(req.body.password, user.hashedPassword)) {
        const access_token_duration = 3600;
        const refresh_token = makeRefreshToken();
        await createRefreshKey({
            token: refresh_token,
            userId: user.id,
            expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
        });
        const token = makeJWT(user.id, access_token_duration, config.api.jwtSecret);
        res.status(200).json({
            id: user.id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            email: user.email,
            token: token,
            refreshToken: refresh_token,
            isChirpyRed: user.isChirpyRed
        });
    }
    else {
        throw new UnauthorizedError("Unauthorized");
    }
}
