import "dotenv/config";
import jwt from "jsonwebtoken";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

if (!JWT_ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET is not configured");
}

export function generateAccessToken(userId: number) {
  return jwt.sign(
    {
      sub: userId,
    },
    JWT_ACCESS_SECRET as string,
    {
      expiresIn: "15m",
    },
  );
}
