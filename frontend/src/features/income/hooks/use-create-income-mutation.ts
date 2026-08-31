import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

import { createIncome } from "@/features/income/api/income.api";
import type { Income, CreateIncomeRequest } from "@/features/income/types/income.types";
import type { ApiError } from "@/services/api/api-error";
import { INCOMES_QUERY_KEY } from "./use-incomes-query";

export function useCreateIncomeMutation(): UseMutationResult<Income, ApiError, CreateIncomeRequest> {
  const queryClient = useQueryClient();

  return useMutation<Income, ApiError, CreateIncomeRequest>({
    mutationFn: createIncome,
    onSuccess: () => {
      // Invalidate the incomes query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: INCOMES_QUERY_KEY });
    },
  });
}
