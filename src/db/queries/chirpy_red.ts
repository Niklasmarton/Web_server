import { db } from "../index.js";
import { users, User } from "../schema.js";
import { eq } from "drizzle-orm";

export async function updateToChirpyRed(userId: string): Promise<User | undefined> {
    const [result] = await db 
    .update(users)
    .set( {isChirpyRed: true})
    .where(eq(users.id, userId))
    .returning()
    return result
}