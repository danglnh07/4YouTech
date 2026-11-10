import crypto from "crypto";
import type { User, Role, UserStatus } from "./store";

export const GOOGLE_STATE_COOKIE = "4youtech_google_oauth_state";
export const AUTH_SESSION_COOKIE = "4youtech_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
  origin: string;
  redirectUri: string;
  isConfigured: boolean;
}

export interface SessionUserPayload {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatar?: string;
  skills?: string[];
  status: UserStatus;
  authProvider?: "local" | "google";
}

interface SignedSessionData {
  user: SessionUserPayload;
  exp: number;
}

/**
 * Resolve the canonical external origin for the incoming request so OAuth redirect URIs
 * work seamlessly on localhost, reverse proxies, and Vercel deployments.
 */
export function resolveRequestOrigin(request: Request): string {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, "");
  }

  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  if (forwardedHost) {
    const proto = forwardedProto || (forwardedHost.includes("localhost") ? "http" : "https");
    return `${proto}://${forwardedHost}`;
  }

  return new URL(request.url).origin;
}

export function getGoogleOAuthConfig(request: Request): GoogleOAuthConfig {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim() || "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim() || "";
  const origin = resolveRequestOrigin(request);
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI?.trim() || `${origin}/api/auth/google/callback`;

  return {
    clientId,
    clientSecret,
    origin,
    redirectUri,
    isConfigured: Boolean(clientId && clientSecret)
  };
}

function getSessionSecret(): string {
  return (
    process.env.AUTH_SESSION_SECRET?.trim() ||
    process.env.GOOGLE_CLIENT_SECRET?.trim() ||
    process.env.MYSQL_PASSWORD?.trim() ||
    "4youtech-local-session-secret"
  );
}

export function sanitizeSessionUser(user: User): SessionUserPayload {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || "",
    avatar: user.avatar || "",
    skills: user.skills || [],
    status: user.status,
    authProvider: user.authProvider || "google"
  };
}

export function signSessionToken(user: User): string {
  const payload: SignedSessionData = {
    user: sanitizeSessionUser(user),
    exp: Date.now() + SESSION_TTL_MS
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = crypto
    .createHmac("sha256", getSessionSecret())
    .update(encodedPayload)
    .digest("base64url");
  return `${encodedPayload}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): SessionUserPayload | null {
  if (!token || !token.includes(".")) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encodedPayload, providedSig] = parts;
  if (!encodedPayload || !providedSig) return null;

  const expectedSig = crypto
    .createHmac("sha256", getSessionSecret())
    .update(encodedPayload)
    .digest("base64url");

  const providedBuf = Buffer.from(providedSig, "utf8");
  const expectedBuf = Buffer.from(expectedSig, "utf8");
  if (providedBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(providedBuf, expectedBuf)) return null;

  try {
    const parsed = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as SignedSessionData;
    if (!parsed?.user?.id || !parsed?.user?.email) return null;
    if (typeof parsed.exp !== "number" || Date.now() > parsed.exp) return null;
    return parsed.user;
  } catch {
    return null;
  }
}

export function safeCompareStrings(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

