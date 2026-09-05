import { z } from "zod";

export const incomeFrequencySchema = z.enum([
  "ONE_TIME",
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "YEARLY",
]);

export const createIncomeSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),

  source: z
    .string()
    .trim()
    .min(1, "Income source is required")
    .max(100, "Income source must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(255, "Description must not exceed 255 characters")
    .optional()
    .nullable(),

  type: z.string().trim().default("income"),

  frequency: incomeFrequencySchema,

  date: z.coerce.date(),
});

export const updateIncomeSchema = createIncomeSchema.partial();

export type CreateIncomeInput = z.infer<typeof createIncomeSchema>;

export type UpdateIncomeInput = z.infer<typeof updateIncomeSchema>;
