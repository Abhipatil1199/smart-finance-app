import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

if (!JWT_ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET is not configured");
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
}

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Invalid authorization header",
    });
  }

  try {
    const payload = jwt.verify(token, JWT_ACCESS_SECRET as string);

    if (
      typeof payload !== "object" ||
      payload === null ||
      typeof payload.sub !== "number"
    ) {
      return res.status(401).json({
        message: "Invalid access token",
      });
    }

    req.user = {
      id: payload.sub,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired access token",
    });
  }
}
