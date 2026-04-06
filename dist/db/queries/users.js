import { db } from "../index.js";
import { users } from "../schema.js";
import { eq } from "drizzle-orm";
export async function createUser(user) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result;
}
export async function deleteUsers() {
    await db
        .delete(users);
}
export async function getPasswordHash(email) {
    const [result] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
    return result.hashedPassword;
}
export async function getUserByEmail(email) {
    const [result] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
    return result;
}
export async function updateUserPassword(userId, hashedPassword, email) {
    const [result] = await db
        .update(users)
        .set({ hashedPassword: hashedPassword, email: email })
        .where(eq(users.id, userId))
        .returning();
    return result;
}
