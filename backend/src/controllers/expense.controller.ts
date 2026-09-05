import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from "../services/expense.service";

import {
  createExpenseSchema,
  updateExpenseSchema,
} from "../schemas/expense.schema";

function parseId(value: string | string[] | undefined): number {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid expense ID");
  }

  return id;
}

export async function createExpenseController(
  req: AuthenticatedRequest,
  res: Response,
) {
  const userId = req.user!.id;

  const payload = createExpenseSchema.parse(req.body);

  const expense = await createExpense(userId, payload);

  return res.status(201).json(expense);
}

export async function getExpensesController(
  req: AuthenticatedRequest,
  res: Response,
) {
  const userId = req.user!.id;

  const expenses = await getExpenses(userId);

  return res.status(200).json(expenses);
}

export async function getExpenseController(
  req: AuthenticatedRequest,
  res: Response,
) {
  const userId = req.user!.id;

  const expenseId = parseId(req.params.id);

  const expense = await getExpenseById(userId, expenseId);

  if (!expense) {
    return res.status(404).json({
      message: "Expense not found",
    });
  }

  return res.status(200).json(expense);
}

export async function updateExpenseController(
  req: AuthenticatedRequest,
  res: Response,
) {
  const userId = req.user!.id;

  const expenseId = parseId(req.params.id);

  const payload = updateExpenseSchema.parse(req.body);

  const expense = await updateExpense(userId, expenseId, payload);

  if (!expense) {
    return res.status(404).json({
      message: "Expense not found",
    });
  }

  return res.status(200).json(expense);
}

export async function deleteExpenseController(
  req: AuthenticatedRequest,
  res: Response,
) {
  const userId = req.user!.id;

  const expenseId = parseId(req.params.id);

  const deleted = await deleteExpense(userId, expenseId);

  if (!deleted) {
    return res.status(404).json({
      message: "Expense not found",
    });
  }

  return res.status(204).send();
}
