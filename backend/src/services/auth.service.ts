import bcrypt from "bcrypt";

import prisma from "../lib/prisma";
import type { SignupRequest, LoginRequest } from "../schemas/auth.schema";
import { generateAccessToken } from "../utils/jwt";
import { generateRefreshToken, hashRefreshToken } from "../utils/refresh-token";

export async function signup(payload: SignupRequest) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(payload.password, 12);

  const user = await prisma.user.create({
    data: {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      passwordHash,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,
    },
  });

  return user;
}

export async function login(payload: LoginRequest) {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const passwordMatches = await bcrypt.compare(
    payload.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const accessToken = generateAccessToken(user.id);

  const refreshToken = generateRefreshToken();

  const refreshTokenHash = hashRefreshToken(refreshToken);

  const refreshTokenExpiresAt = new Date();

  refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 30);

  await prisma.refreshToken.create({
    data: {
      tokenHash: refreshTokenHash,
      userId: user.id,
      expiresAt: refreshTokenExpiresAt,
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  };
}

export async function refreshAccessToken(refreshToken: string) {
  const tokenHash = hashRefreshToken(refreshToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      tokenHash,
    },
    include: {
      user: true,
    },
  });

  if (!storedToken) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  if (storedToken.revokedAt) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  if (storedToken.expiresAt <= new Date()) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  const accessToken = generateAccessToken(storedToken.userId);

  return {
    accessToken,
  };
}
