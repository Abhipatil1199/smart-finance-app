import type { Request, Response } from "express";

import {
  signupSchema,
  loginSchema,
  refreshTokenSchema,
} from "../schemas/auth.schema";
import {
  refreshAccessToken,
  signup as signupUser,
} from "../services/auth.service";
import { login as loginUser } from "../services/auth.service";

export async function signup(req: Request, res: Response) {
  const result = signupSchema.safeParse(req.body);

  console.log("result", result);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      error: result.error.flatten().fieldErrors,
    });
  }

  try {
    const user = await signupUser(result.data);

    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export async function login(req: Request, res: Response) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
  }

  try {
    const loginResult = await loginUser(result.data);

    return res.status(200).json({
      message: "Login successful",
      ...loginResult,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    console.error("Login error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export async function refresh(req: Request, res: Response) {
  const result = refreshTokenSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
  }

  try {
    const resultData = await refreshAccessToken(result.data.refreshToken);

    return res.status(200).json(resultData);
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_REFRESH_TOKEN") {
      return res.status(401).json({
        message: "Invalid or expired refresh token",
      });
    }

    console.error("Refresh token error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}
