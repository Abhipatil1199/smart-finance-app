import type { Request, Response } from "express";

import {
  signupSchema,
  loginSchema,
  refreshTokenSchema,
} from "../schemas/auth.schema";
import {
  refreshAccessToken,
  signup as signupUser,
  logout as logoutUser,
  logoutAll as logoutAllUser,
} from "../services/auth.service";
import { login as loginUser } from "../services/auth.service";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import {
  REFRESH_TOKEN_COOKIE,
  refreshTokenCookieOptions,
} from "../config/cookie";

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

    res.cookie(
      REFRESH_TOKEN_COOKIE,
      loginResult.refreshToken,
      refreshTokenCookieOptions,
    );

    return res.status(200).json({
      message: "Login successful",
      accessToken: loginResult.accessToken,
      user: loginResult.user,
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
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token is missing",
    });
  }

  try {
    const result = await refreshAccessToken(refreshToken);

    res.cookie(
      REFRESH_TOKEN_COOKIE,
      result.refreshToken,
      refreshTokenCookieOptions,
    );

    return res.status(200).json({
      accessToken: result.accessToken,
    });
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

export async function logout(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];

    if (refreshToken) {
      await logoutUser(refreshToken);
    }

    res.clearCookie(REFRESH_TOKEN_COOKIE, refreshTokenCookieOptions);

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export async function logoutAll(req: AuthenticatedRequest, res: Response) {
  try {
    await logoutAllUser(req.user!.id);

    return res.status(200).json({
      message: "Logged out from all devices successfully",
    });
  } catch (error) {
    console.error("Logout all error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}
