import axios from "axios";

/**
 * Error codes the UI branches on. Anything the server sends that is not in
 * this list is surfaced through its `message` instead.
 */
export const ApiErrorCode = {
  Network: "NETWORK_ERROR",
  Timeout: "TIMEOUT",
  Unauthorized: "UNAUTHORIZED",
  Forbidden: "FORBIDDEN",
  NotFound: "NOT_FOUND",
  Conflict: "CONFLICT",
  Validation: "VALIDATION_ERROR",
  RateLimited: "RATE_LIMITED",
  Server: "SERVER_ERROR",
  Unknown: "UNKNOWN",
} as const;

export type ApiErrorCode = (typeof ApiErrorCode)[keyof typeof ApiErrorCode];

/** Per-field messages from the server, keyed by form field name. */
export type FieldErrors = Record<string, string>;

export class ApiError extends Error {
  readonly status: number | null;
  readonly code: ApiErrorCode;
  readonly fieldErrors: FieldErrors;

  constructor(
    message: string,
    options: { status?: number | null; code?: ApiErrorCode; fieldErrors?: FieldErrors } = {}
  ) {
    super(message);
    this.name = "ApiError";
    this.status = options.status ?? null;
    this.code = options.code ?? ApiErrorCode.Unknown;
    this.fieldErrors = options.fieldErrors ?? {};
  }
}

const STATUS_CODES: Record<number, ApiErrorCode> = {
  400: ApiErrorCode.Validation,
  401: ApiErrorCode.Unauthorized,
  403: ApiErrorCode.Forbidden,
  404: ApiErrorCode.NotFound,
  409: ApiErrorCode.Conflict,
  422: ApiErrorCode.Validation,
  429: ApiErrorCode.RateLimited,
};

const DEFAULT_MESSAGES: Record<ApiErrorCode, string> = {
  [ApiErrorCode.Network]:
    "We couldn't reach Smart Finance. Check your connection and try again.",
  [ApiErrorCode.Timeout]: "That took longer than expected. Please try again.",
  [ApiErrorCode.Unauthorized]: "Those credentials don't match our records.",
  [ApiErrorCode.Forbidden]: "You don't have access to do that.",
  [ApiErrorCode.NotFound]: "We couldn't find what you were looking for.",
  [ApiErrorCode.Conflict]: "That account already exists.",
  [ApiErrorCode.Validation]: "Please check the highlighted fields and try again.",
  [ApiErrorCode.RateLimited]: "Too many attempts. Please wait a moment and try again.",
  [ApiErrorCode.Server]: "Something went wrong on our end. Please try again shortly.",
  [ApiErrorCode.Unknown]: "Something went wrong. Please try again.",
};

type ErrorPayload = {
  message?: unknown;
  error?: unknown;
  code?: unknown;
  errors?: unknown;
  fieldErrors?: unknown;
};

function readFieldErrors(payload: ErrorPayload | undefined): FieldErrors {
  const source = payload?.fieldErrors ?? payload?.errors;
  if (!source || typeof source !== "object" || Array.isArray(source)) return {};

  const result: FieldErrors = {};
  for (const [field, message] of Object.entries(source as Record<string, unknown>)) {
    if (typeof message === "string") {
      result[field] = message;
    } else if (Array.isArray(message) && typeof message[0] === "string") {
      result[field] = message[0];
    }
  }
  return result;
}

/**
 * Collapses every failure mode (axios error, thrown string, rejected promise)
 * into one `ApiError`, so components never have to inspect axios internals.
 */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return new ApiError(DEFAULT_MESSAGES[ApiErrorCode.Timeout], {
        code: ApiErrorCode.Timeout,
      });
    }

    const status = error.response?.status ?? null;
    if (status === null) {
      return new ApiError(DEFAULT_MESSAGES[ApiErrorCode.Network], {
        code: ApiErrorCode.Network,
      });
    }

    const code = STATUS_CODES[status] ?? (status >= 500 ? ApiErrorCode.Server : ApiErrorCode.Unknown);
    const payload = error.response?.data as ErrorPayload | undefined;
    const serverMessage =
      typeof payload?.message === "string"
        ? payload.message
        : typeof payload?.error === "string"
          ? payload.error
          : null;

    return new ApiError(serverMessage ?? DEFAULT_MESSAGES[code], {
      status,
      code,
      fieldErrors: readFieldErrors(payload),
    });
  }

  if (error instanceof Error) {
    return new ApiError(error.message || DEFAULT_MESSAGES[ApiErrorCode.Unknown]);
  }

  return new ApiError(DEFAULT_MESSAGES[ApiErrorCode.Unknown]);
}

export function getErrorMessage(error: unknown): string {
  return toApiError(error).message;
}
