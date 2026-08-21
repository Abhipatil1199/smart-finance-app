import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

import { toApiError } from "@/services/api/api-error";

/**
 * Moves per-field messages from an API error onto the matching form fields.
 *
 * `fields` acts as an allowlist: a server that returns an unexpected key can
 * otherwise inject an error onto a field that has no way to display or clear
 * it, leaving the form permanently unsubmittable.
 *
 * Returns true when at least one field error was applied, which tells the
 * caller whether a form-level banner is still needed.
 */
export function applyApiFieldErrors<TFieldValues extends FieldValues>(
  setError: UseFormSetError<TFieldValues>,
  error: unknown,
  fields: readonly Path<TFieldValues>[]
): boolean {
  const { fieldErrors } = toApiError(error);
  let applied = false;

  for (const field of fields) {
    const message = fieldErrors[field];
    if (typeof message === "string" && message.length > 0) {
      setError(field, { type: "server", message });
      applied = true;
    }
  }

  return applied;
}

/**
 * The message for a form-level banner, or null when the failure was already
 * reported on individual fields and a banner would just repeat it.
 */
export function getFormLevelError(error: unknown): string | null {
  if (!error) return null;
  const apiError = toApiError(error);
  return Object.keys(apiError.fieldErrors).length > 0 ? null : apiError.message;
}
