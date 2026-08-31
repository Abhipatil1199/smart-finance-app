import api from "@/services/api/axios";
import type {
  Income,
  CreateIncomeRequest,
  UpdateIncomeRequest,
} from "@/features/income/types/income.types";

/**
 * Creates a new income record.
 * POST /api/incomes
 */
export async function createIncome(data: CreateIncomeRequest): Promise<Income> {
  const response = await api.post<Income>("/api/incomes", data);
  return response.data;
}

/**
 * Retrieves all income records for the authenticated user.
 * GET /api/incomes
 */
export async function getIncomes(): Promise<Income[]> {
  const response = await api.get<Income[]>("/api/incomes");
  return response.data;
}

/**
 * Retrieves a specific income record by ID.
 * GET /api/incomes/:id
 */
export async function getIncomeById(id: number): Promise<Income> {
  const response = await api.get<Income>(`/api/incomes/${id}`);
  return response.data;
}

/**
 * Updates an existing income record.
 * PUT /api/incomes/:id
 */
export async function updateIncome(
  id: number,
  data: UpdateIncomeRequest
): Promise<Income> {
  const response = await api.put<Income>(`/api/incomes/${id}`, data);
  return response.data;
}

/**
 * Deletes an income record.
 * DELETE /api/incomes/:id
 */
export async function deleteIncome(id: number): Promise<void> {
  await api.delete(`/api/incomes/${id}`);
}
