/**
 * Input normalisation applied before values leave the client.
 *
 * This is not XSS defence — React escapes everything it renders, and the
 * server must validate independently. The goal here is narrower: strip the
 * invisible and control characters that let a value look correct in the UI
 * while being something else on the wire (bidi overrides in a display name,
 * a newline smuggled into a header-bound field, zero-width joiners that
 * silently break an email lookup).
 */

// C0/C1 controls, zero-width and bidi-override characters, line/paragraph
// separators, and the BOM.
const INVISIBLE_CHARS =
  // eslint-disable-next-line no-control-regex
  /[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u2028\u2029\u202A-\u202E\u2066-\u2069\uFEFF]/g;

export function stripInvisibleChars(value: string): string {
  return value.replace(INVISIBLE_CHARS, "");
}

/** Trims, removes invisible characters and collapses internal whitespace runs. */
export function normalizeText(value: string): string {
  return stripInvisibleChars(value).replace(/\s+/g, " ").trim();
}

/** Lowercases the address so `A@x.com` and `a@x.com` resolve to one account. */
export function normalizeEmail(value: string): string {
  return stripInvisibleChars(value).trim().toLowerCase();
}

/** Reduces a typed phone number to `+` plus digits, ready for E.164 checks. */
export function normalizePhone(value: string): string {
  const cleaned = stripInvisibleChars(value).trim();
  const hasPlus = cleaned.startsWith("+");
  const digits = cleaned.replace(/\D/g, "");
  return hasPlus ? `+${digits}` : digits;
}

export function countDigits(value: string): number {
  return (value.match(/\d/g) ?? []).length;
}
