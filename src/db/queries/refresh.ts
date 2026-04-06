import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewRefreshToken, RefreshToken, refreshTokens, User } from "../schema.js";

export async function createRefreshKey(refresh_key: NewRefreshToken) {
    const [result] = await db
    .insert(refreshTokens)
    .values(refresh_key)
    .returning();
    return result;
}

export async function revokeRefreshKey(token: string): Promise<void> {
    await db
    .update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(eq(refreshTokens.token, token));
}

export async function getUserFromRefreshKey(refresh_key: string): Promise<RefreshToken | undefined> {
    const [result] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, refresh_key))
    return result
}