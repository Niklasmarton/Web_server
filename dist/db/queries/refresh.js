import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { refreshTokens } from "../schema.js";
export async function createRefreshKey(refresh_key) {
    const [result] = await db
        .insert(refreshTokens)
        .values(refresh_key)
        .returning();
    return result;
}
export async function revokeRefreshKey(token) {
    await db
        .update(refreshTokens)
        .set({ revokedAt: new Date() })
        .where(eq(refreshTokens.token, token));
}
export async function getUserFromRefreshKey(refresh_key) {
    const [result] = await db
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.token, refresh_key));
    return result;
}
