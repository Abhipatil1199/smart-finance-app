import { env, type TokenStorageStrategy } from "@/lib/env";

/**
 * The one place the app knows where an access token lives.
 *
 * This sits in the shared service layer rather than inside `features/auth`
 * because the axios client attaches the token to *every* feature's requests.
 * The auth feature owns the login flow; this owns the storage decision.
 *
 * Trade-off between the three strategies, and why `memory` is the default:
 *
 * - `cookie`   Server sets an httpOnly, Secure, SameSite cookie. The token is
 *              unreadable from JS, so an XSS bug cannot exfiltrate it. This is
 *              the target for production web. Needs CSRF protection and a
 *              CORS origin allowlist, so it has to land together with the API.
 * - `memory`   A module-scoped variable. Also unreadable from persisted
 *              storage and wiped on reload, so a stolen token has the lifetime
 *              of a tab. Costs a silent-refresh round trip on every reload.
 * - `session`  sessionStorage. Survives reloads within a tab, but any injected
 *              script can read it. Offered for local development and for the
 *              Capacitor shell, where there is no browser reload to survive
 *              and the WebView origin is not shared with third-party scripts.
 *
 * `memory` is the default because it is the safest option that works without
 * backend cooperation. Switching to `cookie` later means changing one env var:
 * the interceptor stops sending a header, `withCredentials` turns on, and no
 * component changes.
 */
export interface TokenStorage {
  readonly strategy: TokenStorageStrategy;
  /** Whether the browser sends credentials automatically for this strategy. */
  readonly usesCredentials: boolean;
  getAccessToken(): string | null;
  setAccessToken(token: string | null): void;
  clear(): void;
}

function createMemoryTokenStorage(): TokenStorage {
  let accessToken: string | null = null;

  return {
    strategy: "memory",
    usesCredentials: false,
    getAccessToken: () => accessToken,
    setAccessToken: (token) => {
      accessToken = token;
    },
    clear: () => {
      accessToken = null;
    },
  };
}

const SESSION_KEY = "smart-finance.access-token";

function createSessionTokenStorage(): TokenStorage {
  // Storage throws in private mode and in some embedded WebViews, so every
  // access is guarded and degrades to in-memory behaviour.
  const fallback = createMemoryTokenStorage();

  const read = (): string | null => {
    try {
      return window.sessionStorage.getItem(SESSION_KEY);
    } catch {
      return fallback.getAccessToken();
    }
  };

  const write = (token: string | null): void => {
    try {
      if (token === null) window.sessionStorage.removeItem(SESSION_KEY);
      else window.sessionStorage.setItem(SESSION_KEY, token);
    } catch {
      fallback.setAccessToken(token);
    }
  };

  return {
    strategy: "session",
    usesCredentials: false,
    getAccessToken: read,
    setAccessToken: write,
    clear: () => write(null),
  };
}

/**
 * The token is in an httpOnly cookie, so there is deliberately nothing to
 * read or write here — the browser attaches it and the server clears it.
 * Session state is recovered by calling the API's "current user" endpoint.
 */
function createCookieTokenStorage(): TokenStorage {
  return {
    strategy: "cookie",
    usesCredentials: true,
    getAccessToken: () => null,
    setAccessToken: () => {},
    clear: () => {},
  };
}

function createTokenStorage(strategy: TokenStorageStrategy): TokenStorage {
  switch (strategy) {
    case "cookie":
      return createCookieTokenStorage();
    case "session":
      return createSessionTokenStorage();
    case "memory":
    default:
      return createMemoryTokenStorage();
  }
}

export const tokenStorage: TokenStorage = createTokenStorage(env.authTokenStrategy);
