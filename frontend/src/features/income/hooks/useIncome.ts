import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseQueryResult, UseMutationResult } from "@tanstack/react-query";

import {
  getIncomes,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome,
} from "@/features/income/api/income.api";
import type {
  Income,
  CreateIncomeRequest,
  UpdateIncomeRequest,
} from "@/features/income/types/income.types";
import type { ApiError } from "@/services/api/api-error";

// ----------------------------------------------------------------------------
// Query Keys
// ----------------------------------------------------------------------------

export const incomeKeys = {
  all: ["incomes"] as const,
  detail: (id: number) => ["income", id] as const,
};

// ----------------------------------------------------------------------------
// Queries
// ----------------------------------------------------------------------------

export function useIncomes(): UseQueryResult<Income[], ApiError> {
  return useQuery<Income[], ApiError>({
    queryKey: incomeKeys.all,
    queryFn: getIncomes,
  });
}

export function useIncome(id: number, options?: { enabled?: boolean }): UseQueryResult<Income, ApiError> {
  return useQuery<Income, ApiError>({
    queryKey: incomeKeys.detail(id),
    queryFn: () => getIncomeById(id),
    enabled: options?.enabled !== false && !isNaN(id),
  });
}

// ----------------------------------------------------------------------------
// Mutations
// ----------------------------------------------------------------------------

export function useCreateIncome(): UseMutationResult<Income, ApiError, CreateIncomeRequest> {
  const queryClient = useQueryClient();

  return useMutation<Income, ApiError, CreateIncomeRequest>({
    mutationFn: createIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: incomeKeys.all });
    },
  });
}

export function useUpdateIncome(): UseMutationResult<
  Income,
  ApiError,
  { id: number; data: UpdateIncomeRequest }
> {
  const queryClient = useQueryClient();

  return useMutation<Income, ApiError, { id: number; data: UpdateIncomeRequest }>({
    mutationFn: ({ id, data }) => updateIncome(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: incomeKeys.all });
      queryClient.invalidateQueries({ queryKey: incomeKeys.detail(variables.id) });
    },
  });
}

export function useDeleteIncome(): UseMutationResult<void, ApiError, number> {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, number>({
    mutationFn: deleteIncome,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: incomeKeys.all });
      queryClient.removeQueries({ queryKey: incomeKeys.detail(deletedId) });
    },
  });
}
