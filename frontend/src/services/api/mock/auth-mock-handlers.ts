import type { MockHandler, MockRequest, MockResult } from "@/services/api/mock/install-mock-api";

/**
 * Stand-in for the auth service.
 *
 * This file deliberately declares its own copy of the request/response shapes
 * instead of importing them from `features/auth`. It plays the role of the
 * server, and the server owns its contract independently — that keeps the
 * dependency arrow pointing one way and makes the file safe to delete wholesale
 * once the real API is live.
 *
 * Credentials are compared in plain text here. That is acceptable only because
 * nothing in this file ships to production: it is tree-shaken out whenever
 * VITE_ENABLE_MOCK_API is false.
 */

export const DEMO_ACCOUNT = {
  email: "demo@smartfinance.app",
  password: "Password@123",
} as const;

type MockAccount = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
};

const accounts = new Map<string, MockAccount>([
  [
    DEMO_ACCOUNT.email,
    {
      id: "usr_demo_0001",
      firstName: "Ada",
      lastName: "Sterling",
      email: DEMO_ACCOUNT.email,
      phone: "+14155550142",
      password: DEMO_ACCOUNT.password,
      createdAt: new Date("2026-01-14T09:12:00.000Z").toISOString(),
    },
  ],
]);

const LATENCY_MS = 850;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function base64Url(value: string): string {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Structurally a JWT so the client code path is realistic. Not signed. */
function issueToken(accountId: string): string {
  const issuedAt = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "none", typ: "JWT" }));
  const payload = base64Url(
    JSON.stringify({ sub: accountId, iat: issuedAt, exp: issuedAt + 900, scope: "mock" })
  );
  return `${header}.${payload}.mock-signature`;
}

function toPublicUser(account: MockAccount) {
  return {
    id: account.id,
    firstName: account.firstName,
    lastName: account.lastName,
    email: account.email,
    phone: account.phone,
    createdAt: account.createdAt,
  };
}

function sessionResponse(account: MockAccount) {
  return {
    user: toPublicUser(account),
    tokens: {
      accessToken: issueToken(account.id),
      refreshToken: `mock-refresh.${account.id}`,
      expiresIn: 900,
    },
  };
}

function readString(body: Record<string, unknown>, key: string): string {
  const value = body[key];
  return typeof value === "string" ? value.trim() : "";
}

const handleSignup: MockHandler = async (request: MockRequest): Promise<MockResult | null> => {
  if (request.method !== "POST" || request.path !== "/auth/signup") return null;

  await delay(LATENCY_MS);

  const email = readString(request.body, "email").toLowerCase();
  const firstName = readString(request.body, "firstName");
  const lastName = readString(request.body, "lastName");
  const phone = readString(request.body, "phone");
  const password = readString(request.body, "password");

  if (!email || !firstName || !lastName || !phone || !password) {
    return {
      status: 422,
      data: {
        message: "Please check the highlighted fields and try again.",
        code: "VALIDATION_ERROR",
        fieldErrors: {
          ...(firstName ? {} : { firstName: "First name is required." }),
          ...(lastName ? {} : { lastName: "Last name is required." }),
          ...(email ? {} : { email: "Email address is required." }),
          ...(phone ? {} : { phone: "Phone number is required." }),
          ...(password ? {} : { password: "Password is required." }),
        },
      },
    };
  }

  if (accounts.has(email)) {
    return {
      status: 409,
      data: {
        message: "An account with this email already exists.",
        code: "CONFLICT",
        fieldErrors: { email: "An account with this email already exists." },
      },
    };
  }

  const account: MockAccount = {
    id: `usr_${Math.random().toString(36).slice(2, 10)}`,
    firstName,
    lastName,
    email,
    phone,
    password,
    createdAt: new Date().toISOString(),
  };
  accounts.set(email, account);

  return { status: 201, data: sessionResponse(account) };
};

const handleSignin: MockHandler = async (request: MockRequest): Promise<MockResult | null> => {
  if (request.method !== "POST" || request.path !== "/auth/signin") return null;

  await delay(LATENCY_MS);

  const email = readString(request.body, "email").toLowerCase();
  const password = readString(request.body, "password");
  const account = accounts.get(email);

  // One generic message for both branches: telling the caller which half was
  // wrong turns the sign-in form into an account-enumeration oracle.
  if (!account || account.password !== password) {
    return {
      status: 401,
      data: {
        message: "That email and password combination doesn't match our records.",
        code: "UNAUTHORIZED",
      },
    };
  }

  return { status: 200, data: sessionResponse(account) };
};

const handleSignout: MockHandler = async (request: MockRequest): Promise<MockResult | null> => {
  if (request.method !== "POST" || request.path !== "/auth/signout") return null;
  await delay(200);
  return { status: 204, data: null };
};

export const authMockHandlers: MockHandler[] = [handleSignup, handleSignin, handleSignout];
