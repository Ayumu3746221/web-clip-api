import { DrizzleClient } from "../db/client"
import { insertUser } from "../repositories/user.repository"
import { insertUserAuthentication } from "../repositories/user_authentication.repository";

export const createUser = async (
    db : DrizzleClient,
    userData: { email: string, name: string},
    providerData: { provider: string, providerUserId: string }
) => {
    try {
        const userId = await insertUser(db, userData);
        await insertUserAuthentication(db, userId, providerData.providerUserId, providerData.provider);

        return userId;
    } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user in service logic");
    }
}