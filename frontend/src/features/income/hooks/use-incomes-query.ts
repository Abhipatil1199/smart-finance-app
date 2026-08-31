import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { getIncomes } from "@/features/income/api/income.api";
import type { Income } from "@/features/income/types/income.types";
import type { ApiError } from "@/services/api/api-error";

export const INCOMES_QUERY_KEY = ["incomes"];

export function useIncomesQuery(): UseQueryResult<Income[], ApiError> {
  return useQuery<Income[], ApiError>({
    queryKey: INCOMES_QUERY_KEY,
    queryFn: getIncomes,
  });
}
