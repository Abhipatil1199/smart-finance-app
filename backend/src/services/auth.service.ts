import bcrypt from "bcrypt";

import prisma from "../lib/prisma";
import type { SignupRequest, LoginRequest } from "../schemas/auth.schema";

export async function signup(payload: SignupRequest) {
    const existingUser = await prisma.user.findUnique({
        where : {
            email: payload.email,
        }
    });

    if(existingUser) {
        throw new Error("EMAIL_ALREADY_EXISTS")
    }

    const passwordHash = await bcrypt.hash(payload.password, 12);

    const user =  await prisma.user.create({
        data: {
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            passwordHash
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
        }
    });

    return user;
};

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
  )

  if (!passwordMatches) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };
}
