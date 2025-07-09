import { DrizzleClient } from "../db/client";
import { users } from "../db/schema";

export const findUserById = async (db : DrizzleClient, userId: number) => {
    const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.userId, userId),
    });
    return user;
}

export const insertUser = async (db: DrizzleClient, userData: { email: string, name: string }) => {
    const userId = await db.insert(users).values({
        email: userData.email,
        username: userData.name,
    }).returning({insertUserId: users.userId});
    return userId[0].insertUserId;
}