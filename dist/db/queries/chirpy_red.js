import { db } from "../index.js";
import { users } from "../schema.js";
import { eq } from "drizzle-orm";
export async function updateToChirpyRed(userId) {
    const [result] = await db
        .update(users)
        .set({ isChirpyRed: true })
        .where(eq(users.id, userId))
        .returning();
    return result;
}
