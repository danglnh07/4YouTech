import crypto from "crypto";
import { NextResponse } from "next/server";
import { getGoogleOAuthConfig, GOOGLE_STATE_COOKIE } from "@/lib/google-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { clientId, origin, redirectUri, isConfigured } = getGoogleOAuthConfig(request);

  if (!isConfigured) {
    const fallbackUrl = new URL("/", origin);
    fallbackUrl.searchParams.set("auth_tab", "auth");
    fallbackUrl.searchParams.set("google_error", "not_configured");
    return NextResponse.redirect(fallbackUrl);
  }

  const state = crypto.randomBytes(32).toString("hex");

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  // Force Google Account Chooser so all Google accounts signed into the user's browser/device are listed
  authUrl.searchParams.set("prompt", "select_account");
  authUrl.searchParams.set("access_type", "online");
  authUrl.searchParams.set("include_granted_scopes", "true");
  authUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authUrl.toString());
  response.cookies.set(GOOGLE_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: origin.startsWith("https://"),
    path: "/",
    maxAge: 60 * 10
  });

  return response;
}

