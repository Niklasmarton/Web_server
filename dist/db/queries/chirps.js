import { db } from "../index.js";
import { chirps } from "../schema.js";
import { asc, desc, eq } from "drizzle-orm";
export async function createChirp(chirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .onConflictDoNothing()
        .returning();
    return result;
}
export async function getChirps(authorId, sort) {
    const orderExpr = sort === "desc" ? desc(chirps.createdAt) : asc(chirps.createdAt);
    const result = await db
        .select()
        .from(chirps)
        .where(authorId ? eq(chirps.userId, authorId) : undefined)
        .orderBy(orderExpr);
    return result;
}
export async function getSingleChirp(chirpId) {
    const [result] = await db
        .select()
        .from(chirps)
        .where(eq(chirps.id, chirpId));
    return result;
}
export async function deleteChirp(chirpId) {
    const [result] = await db
        .delete(chirps)
        .where(eq(chirps.id, chirpId))
        .returning();
    return result;
}
