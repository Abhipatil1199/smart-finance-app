import { useId } from "react";
import type { FieldError as RhfFieldError } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";

/** Accessibility props the field owns and the control must spread. */
export type FormFieldControl = {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby": string | undefined;
};

export type FormFieldProps = {
  name: string;
  label: React.ReactNode;
  /** A react-hook-form error for this field, if any. */
  error?: RhfFieldError;
  description?: React.ReactNode;
  /** Rendered opposite the label, e.g. a "Forgot password?" link. */
  action?: React.ReactNode;
  optional?: boolean;
  className?: string;
  children: (control: FormFieldControl) => React.ReactNode;
};

/**
 * Collects every message when the form runs with `criteriaMode: "all"`, so a
 * password can report all its unmet rules at once instead of one per attempt.
 */
function toMessages(error?: RhfFieldError): string[] {
  if (!error) return [];

  if (error.types) {
    const messages = Object.values(error.types).flatMap((value) =>
      Array.isArray(value) ? value : [value]
    );
    const strings = messages.filter((value): value is string => typeof value === "string");
    if (strings.length > 0) return [...new Set(strings)];
  }

  return typeof error.message === "string" && error.message ? [error.message] : [];
}

/**
 * Label + control + error/description, wired together with matching ids.
 *
 * Generic on purpose: it takes a render function rather than an input, so any
 * future feature can drop in a select, textarea or amount field without
 * touching this component.
 */
export function FormField({
  name,
  label,
  error,
  description,
  action,
  optional = false,
  className,
  children,
}: FormFieldProps) {
  const reactId = useId();
  const id = `${name}-${reactId}`;
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;

  const messages = toMessages(error);
  const hasError = messages.length > 0;

  const describedBy =
    [description ? descriptionId : null, hasError ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    // `data-invalid` is deliberately not set: it would tint the whole group
    // destructive, including the text being typed. The red ring comes from
    // `aria-invalid` on the control, and the message is red on its own.
    <Field className={cn("gap-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <FieldLabel htmlFor={id}>
          {label}
          {optional ? (
            <span className="font-normal text-muted-foreground">(optional)</span>
          ) : null}
        </FieldLabel>
        {action}
      </div>

      {children({ id, "aria-invalid": hasError, "aria-describedby": describedBy })}

      {description ? (
        <FieldDescription id={descriptionId}>{description}</FieldDescription>
      ) : null}

      {hasError ? (
        <FieldError id={errorId}>
          {messages.length === 1 ? (
            messages[0]
          ) : (
            <ul className="ml-4 flex list-disc flex-col gap-1">
              {messages.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          )}
        </FieldError>
      ) : null}
    </Field>
  );
}
