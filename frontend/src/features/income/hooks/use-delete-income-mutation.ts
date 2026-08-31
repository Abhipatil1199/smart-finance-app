import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

import { deleteIncome } from "@/features/income/api/income.api";
import type { ApiError } from "@/services/api/api-error";
import { INCOMES_QUERY_KEY } from "./use-incomes-query";

export function useDeleteIncomeMutation(): UseMutationResult<void, ApiError, number> {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, number>({
    mutationFn: deleteIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INCOMES_QUERY_KEY });
    },
  });
}
