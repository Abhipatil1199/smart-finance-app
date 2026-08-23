import type { Response } from "express";

import type { AuthenticatedRequest } from "../middleware/auth.middleware";
import prisma from "../lib/prisma";

export async function getMe(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.id;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  return res.status(200).json({
    user,
  });
}
