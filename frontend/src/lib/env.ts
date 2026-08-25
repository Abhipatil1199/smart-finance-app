/**
 * Single, typed read of `import.meta.env`.
 *
 * Everything else in the app imports from here so that a missing or renamed
 * variable surfaces in one place instead of as `undefined` deep in a request.
 */

function readString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function readBoolean(value: unknown, fallback: boolean): boolean {
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

const TOKEN_STRATEGIES = ["memory", "session", "cookie"] as const;

export type TokenStorageStrategy = (typeof TOKEN_STRATEGIES)[number];

function readPositiveInt(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function readTokenStrategy(value: unknown): TokenStorageStrategy {
  return TOKEN_STRATEGIES.includes(value as TokenStorageStrategy)
    ? (value as TokenStorageStrategy)
    : "memory";
}

export const env = {
  apiUrl: readString(import.meta.env.VITE_API_URL, "http://localhost:5000"),
  apiTimeoutMs: readPositiveInt(import.meta.env.VITE_API_TIMEOUT_MS, 15_000),


  authTokenStrategy: readTokenStrategy(import.meta.env.VITE_AUTH_TOKEN_STRATEGY),

  isDev: import.meta.env.DEV,
} as const;
