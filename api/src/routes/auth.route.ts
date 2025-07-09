import { googleAuth } from "@hono/oauth-providers/google";
import { Hono } from "hono";
import { findUserIdByProviderId } from "../repositories/user_authentication.repository";
import { createJwt } from "../services/jsonwebtoken";
import { createUser } from "../services/user";

type Bindings = import("../index").Bindings;
type Variables = { db: import("../db/client").DrizzleClient };

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use(
  '/google',
  googleAuth({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    scope: ["openid", "email", "profile"],
  })
);

app.get('/google', async (c) => {
  try {
    const db = c.get("db");
    const user = c.get("user-google");

    if (!user) {
      return c.json({ error: "Google authentication failed" }, 401);
    }
    if (!user.id) {
      return c.json({ error: "Google user Id not Provided" }, 400);
    }
    if (!user.email || !user.name) {
      return c.json(
        {
          error:
            "Required user information (email or name) not provided by Google",
        },
        400
      );
    }

    const providerUserId = user.id;
    const userId: number | null = await findUserIdByProviderId(
      db,
      providerUserId,
      "google"
    );

    if (userId) {
      // Handling existing user
      const jwt = await createJwt(userId);
      return c.json(
        {
          message: "User authenticated successfully",
          token: jwt,
        },
        200
      );
    } else {
      // Handling new user
      const newUserId = await createUser(
        db,
        {
          email: user.email || "",
          name: user.name || "",
        },
        {
          provider: "google",
          providerUserId: providerUserId,
        }
      );

      const jwt = await createJwt(newUserId);
      return c.json(
        {
          message: "User created and authenticated successfully",
          token: jwt,
        },
        201
      );
    }
  } catch (error) {
    console.error("Error during Google authentication:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default app;
