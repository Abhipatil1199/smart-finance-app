import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

import {
  createIncome,
  getIncomes,
  getIncomeById,
  updateIncome,
  deleteIncome,
} from "../services/income.service";

import {
  createIncomeSchema,
  updateIncomeSchema,
} from "../schemas/income.schema";

function parseId(value: string | string[] | undefined): number {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid income ID");
  }

  return id;
}

export async function createIncomeController(
  req: AuthenticatedRequest,
  res: Response,
) {
  const userId = req.user!.id;

  const payload = createIncomeSchema.parse(req.body);

  const income = await createIncome(userId, payload);

  return res.status(201).json(income);
}

export async function getIncomesController(
  req: AuthenticatedRequest,
  res: Response,
) {
  const userId = req.user!.id;

  const incomes = await getIncomes(userId);

  return res.status(200).json(incomes);
}

export async function getIncomeController(
  req: AuthenticatedRequest,
  res: Response,
) {
  const userId = req.user!.id;

  const incomeId = parseId(req.params.id);

  const income = await getIncomeById(userId, incomeId);

  if (!income) {
    return res.status(404).json({
      message: "Income not found",
    });
  }

  return res.status(200).json(income);
}

export async function updateIncomeController(
  req: AuthenticatedRequest,
  res: Response,
) {
  const userId = req.user!.id;

  const incomeId = parseId(req.params.id);

  const payload = updateIncomeSchema.parse(req.body);

  const income = await updateIncome(userId, incomeId, payload);

  if (!income) {
    return res.status(404).json({
      message: "Income not found",
    });
  }

  return res.status(200).json(income);
}

export async function deleteIncomeController(
  req: AuthenticatedRequest,
  res: Response,
) {
  const userId = req.user!.id;

  const incomeId = parseId(req.params.id);

  const deleted = await deleteIncome(userId, incomeId);

  if (!deleted) {
    return res.status(404).json({
      message: "Income not found",
    });
  }

  return res.status(204).send();
}
