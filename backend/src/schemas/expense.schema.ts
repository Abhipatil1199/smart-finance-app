import { z } from "zod";

export const createExpenseSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),

  category: z
    .string()
    .trim()
    .min(1, "Expense category is required")
    .max(100, "Expense category must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(255, "Description must not exceed 255 characters")
    .optional()
    .nullable(),

  type: z.string().trim().default("expense"),

  date: z.coerce.date(),
});

export const updateExpenseSchema = createExpenseSchema.partial();

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;

export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
