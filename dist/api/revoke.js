import { getBearerToken } from "../auth.js";
import { UnauthorizedError } from "./errors.js";
import { getUserFromRefreshKey, revokeRefreshKey } from "../db/queries/refresh.js";
export async function revokeRefreshToken(req, res) {
    const refresh_key = getBearerToken(req);
    const refresh_token_obj = await getUserFromRefreshKey(refresh_key);
    if (!refresh_token_obj) {
        throw new UnauthorizedError("could not find refresh key");
    }
    await revokeRefreshKey(refresh_token_obj.token);
    res.status(204).send();
}
