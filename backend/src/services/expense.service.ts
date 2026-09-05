import prisma from "../config/prisma";
import type {
  CreateExpenseInput,
  UpdateExpenseInput,
} from "../schemas/expense.schema";

export async function createExpense(
  userId: number,
  payload: CreateExpenseInput,
) {
  return prisma.expense.create({
    data: {
      userId,
      amount: payload.amount,
      category: payload.category,
      description: payload.description,
      type: payload.type ?? "expense",
      date: payload.date,
    },
  });
}

export async function getExpenses(userId: number) {
  return prisma.expense.findMany({
    where: {
      userId,
    },
    orderBy: {
      date: "desc",
    },
  });
}

export async function getExpenseById(userId: number, expenseId: number) {
  return prisma.expense.findFirst({
    where: {
      id: expenseId,
      userId,
    },
  });
}

export async function updateExpense(
  userId: number,
  expenseId: number,
  payload: UpdateExpenseInput,
) {
  const existingExpense = await prisma.expense.findFirst({
    where: {
      id: expenseId,
      userId,
    },
  });

  if (!existingExpense) {
    return null;
  }

  return prisma.expense.update({
    where: {
      id: expenseId,
    },
    data: payload,
  });
}

export async function deleteExpense(userId: number, expenseId: number) {
  const existingExpense = await prisma.expense.findFirst({
    where: {
      id: expenseId,
      userId,
    },
  });

  if (!existingExpense) {
    return false;
  }

  const deleted = await prisma.expense.delete({
    where: {
      id: expenseId,
    },
  });

  return deleted;
}
