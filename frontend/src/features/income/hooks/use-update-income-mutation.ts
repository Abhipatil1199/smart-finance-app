import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

import { updateIncome } from "@/features/income/api/income.api";
import type { Income, UpdateIncomeRequest } from "@/features/income/types/income.types";
import type { ApiError } from "@/services/api/api-error";
import { INCOMES_QUERY_KEY } from "./use-incomes-query";

interface UpdateIncomeVariables {
  id: number;
  data: UpdateIncomeRequest;
}

export function useUpdateIncomeMutation(): UseMutationResult<Income, ApiError, UpdateIncomeVariables> {
  const queryClient = useQueryClient();

  return useMutation<Income, ApiError, UpdateIncomeVariables>({
    mutationFn: ({ id, data }) => updateIncome(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INCOMES_QUERY_KEY });
    },
  });
}
