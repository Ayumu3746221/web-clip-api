import { DrizzleClient } from "../db/client";
import { userAuthentications } from "../db/schema";
import { and, eq } from "drizzle-orm";

export const findUserIdByProviderId = async (db: DrizzleClient, providerUserId: string, provider: string): Promise<number | null> => {
    const result = await db.select({
        userId : userAuthentications.userId
    }).from(userAuthentications).where(and(
        eq(userAuthentications.providerUserId, providerUserId),
        eq(userAuthentications.provider, provider)
    )).limit(1);
    return result[0]?.userId ?? null;
};

export const insertUserAuthentication = async (db: DrizzleClient, userId: number, providerUserId: string, provider: string) => {
    return await db.insert(userAuthentications).values({
        userId: userId,
        provider: provider,
        providerUserId: providerUserId
    });
}