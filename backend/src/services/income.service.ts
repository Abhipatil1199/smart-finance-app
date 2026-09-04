import prisma from "../config/prisma";
import type {
  CreateIncomeInput,
  UpdateIncomeInput,
} from "../schemas/income.schema";

export async function createIncome(userId: number, payload: CreateIncomeInput) {
  return prisma.income.create({
    data: {
      userId,
      amount: payload.amount,
      source: payload.source,
      frequency: payload.frequency,
      date: payload.date,
    },
  });
}

export async function getIncomes(userId: number) {
  return prisma.income.findMany({
    where: {
      userId,
    },
    orderBy: {
      date: "desc",
    },
  });
}

export async function getIncomeById(userId: number, incomeId: number) {
  return prisma.income.findFirst({
    where: {
      id: incomeId,
      userId,
    },
  });
}

export async function updateIncome(
  userId: number,
  incomeId: number,
  payload: UpdateIncomeInput,
) {
  const existingIncome = await prisma.income.findFirst({
    where: {
      id: incomeId,
      userId,
    },
  });

  if (!existingIncome) {
    return null;
  }

  return prisma.income.update({
    where: {
      id: incomeId,
    },
    data: payload,
  });
}

export async function deleteIncome(userId: number, incomeId: number) {
  const existingIncome = await prisma.income.findFirst({
    where: {
      id: incomeId,
      userId,
    },
  });

  console.log("existingIncome", existingIncome);

  if (!existingIncome) {
    return false;
  }

  const deleted = await prisma.income.delete({
    where: {
      id: incomeId,
    },
  });

  return deleted;
}
