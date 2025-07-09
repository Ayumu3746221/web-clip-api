import { Jwt } from "hono/utils/jwt";

export const createJwt = (userId: number) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("Please set JWT_SECRET in your environment variables");
    }

    const payload = {
        "sub": userId,
        "iat": Math.floor(Date.now() / 1000),
        "exp": Math.floor(Date.now() / 1000) + (60 * 60 * 24),
        "iss": "books-clip-api"
    }

    return Jwt.sign(payload, secret, "HS256");
}