import { hashPassword } from "src/auth.js";
import { db } from "../index.js";
import { NewUser, users, User } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function deleteUsers() {
  await db
    .delete(users)
}

export async function getPasswordHash(email: string): Promise<string | undefined> {
  const [result] = await db
  .select()
  .from(users)
  .where(eq(users.email, email))
  return result.hashedPassword
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
    const [result] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    return result
}

export async function updateUserPassword(userId: string, hashedPassword: string, email: string): Promise<User | undefined> {
      const [result] = await db
    .update(users)
    .set({ hashedPassword: hashedPassword, email: email} )
    .where(eq(users.id, userId))
    .returning()
    return result
}