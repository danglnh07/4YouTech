import { NextRequest, NextResponse } from "next/server";
import { queryDb } from "@/lib/db";
import { SEED_USERS, type User, type Role, type UserStatus } from "@/lib/store";
import {
  AUTH_SESSION_COOKIE,
  GOOGLE_STATE_COOKIE,
  getGoogleOAuthConfig,
  safeCompareStrings,
  signSessionToken
} from "@/lib/google-auth";

export const dynamic = "force-dynamic";

interface GoogleTokenResponse {
  access_token?: string;
  id_token?: string;
  expires_in?: number;
  token_type?: string;
  error?: string;
  error_description?: string;
}

interface GoogleUserInfo {
  sub?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email?: string;
  email_verified?: boolean | string;
}

function redirectWithError(origin: string, code: string) {
  const errUrl = new URL("/", origin);
  errUrl.searchParams.set("auth_tab", "auth");
  errUrl.searchParams.set("google_error", code);
  const res = NextResponse.redirect(errUrl);
  res.cookies.delete(GOOGLE_STATE_COOKIE);
  return res;
}

interface DbUserRow {
  UserId?: string;
  userid?: string;
  Name?: string;
  name?: string;
  Email?: string;
  email?: string;
  Role?: string;
  role?: string;
  Phone?: string | null;
  phone?: string | null;
  AvatarUrl?: string | null;
  avatarurl?: string | null;
  Status?: string;
  status?: string;
  SkillsJson?: string | null;
  skillsjson?: string | null;
}

function mapDbRowToUser(row: DbUserRow): User {
  const rawSkills = row.SkillsJson || row.skillsjson;
  let skills: string[] = [];
  if (rawSkills) {
    try {
      skills = JSON.parse(rawSkills);
    } catch {
      skills = [];
    }
  }
  return {
    id: row.UserId || row.userid || "",
    name: row.Name || row.name || "",
    email: row.Email || row.email || "",
    role: (row.Role || row.role || "customer") as Role,
    phone: row.Phone || row.phone || "",
    avatar: row.AvatarUrl || row.avatarurl || "",
    status: (row.Status || row.status || "active") as UserStatus,
    skills,
    authProvider: "google"
  };
}

async function upsertGoogleUser(profile: {
  email: string;
  name: string;
  picture: string;
}): Promise<{ user?: User; errorCode?: string }> {
  const cleanEmail = profile.email.trim().toLowerCase();
  const displayName = profile.name.trim() || cleanEmail.split("@")[0];
  const avatarUrl = profile.picture.trim();

  try {
    const existingRows = await queryDb<DbUserRow>(
      `SELECT * FROM "Users" WHERE LOWER("Email") = ? LIMIT 1`,
      [cleanEmail]
    );

    if (existingRows && existingRows.length > 0) {
      const existing = mapDbRowToUser(existingRows[0]);
      if (existing.status === "locked") {
        return { errorCode: "account_locked" };
      }

      const nextStatus: UserStatus = existing.status === "pending_otp" ? "active" : existing.status;
      const nextAvatar = existing.avatar || avatarUrl;
      const nextName = existing.name || displayName;

      await queryDb(
        `UPDATE "Users" SET "Name" = ?, "AvatarUrl" = ?, "Status" = ? WHERE "UserId" = ?`,
        [nextName, nextAvatar || null, nextStatus, existing.id]
      );

      return {
        user: {
          ...existing,
          name: nextName,
          avatar: nextAvatar,
          status: nextStatus,
          authProvider: "google"
        }
      };
    }

    const newUser: User = {
      id: `usr-gg-${Date.now()}`,
      name: displayName,
      email: cleanEmail,
      role: "customer",
      phone: "",
      avatar: avatarUrl,
      status: "active",
      skills: [],
      authProvider: "google"
    };

    await queryDb(
      `INSERT INTO "Users" ("UserId", "Name", "Email", "PasswordHash", "Role", "Phone", "SkillsJson", "AvatarUrl", "Status")
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newUser.id,
        newUser.name,
        newUser.email,
        null,
        newUser.role,
        null,
        null,
        newUser.avatar || null,
        newUser.status
      ]
    );

    return { user: newUser };
  } catch (dbErr) {
    console.warn("Google OAuth DB upsert fallback to seed/session:", dbErr);

    const seedMatch = SEED_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
    if (seedMatch) {
      if (seedMatch.status === "locked") {
        return { errorCode: "account_locked" };
      }
      return {
        user: {
          ...seedMatch,
          password: undefined,
          avatar: seedMatch.avatar || avatarUrl,
          status: seedMatch.status === "pending_otp" ? "active" : seedMatch.status,
          authProvider: "google"
        }
      };
    }

    return {
      user: {
        id: `usr-gg-${Date.now()}`,
        name: displayName,
        email: cleanEmail,
        role: "customer",
        phone: "",
        avatar: avatarUrl,
        status: "active",
        skills: [],
        authProvider: "google"
      }
    };
  }
}

export async function GET(request: NextRequest) {
  const { clientId, clientSecret, origin, redirectUri, isConfigured } = getGoogleOAuthConfig(request);

  if (!isConfigured) {
    return redirectWithError(origin, "not_configured");
  }

  const searchParams = request.nextUrl.searchParams;
  const oauthError = searchParams.get("error");
  if (oauthError) {
    return redirectWithError(origin, oauthError === "access_denied" ? "cancelled" : "oauth_failed");
  }

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const cookieState = request.cookies.get(GOOGLE_STATE_COOKIE)?.value;

  if (!code || !state || !cookieState || !safeCompareStrings(state, cookieState)) {
    return redirectWithError(origin, "invalid_state");
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      }).toString(),
      cache: "no-store"
    });

    const tokenData = (await tokenRes.json()) as GoogleTokenResponse;
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Google token exchange error:", tokenData);
      return redirectWithError(origin, "token_exchange_failed");
    }

    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
      cache: "no-store"
    });

    if (!userInfoRes.ok) {
      return redirectWithError(origin, "userinfo_failed");
    }

    const userInfo = (await userInfoRes.json()) as GoogleUserInfo;
    const isVerified = userInfo.email_verified === true || userInfo.email_verified === "true";

    if (!userInfo.email || !isVerified) {
      return redirectWithError(origin, "email_not_verified");
    }

    const result = await upsertGoogleUser({
      email: userInfo.email,
      name: userInfo.name || userInfo.given_name || userInfo.email.split("@")[0],
      picture: userInfo.picture || ""
    });

    if (result.errorCode || !result.user) {
      return redirectWithError(origin, result.errorCode || "oauth_failed");
    }

    const sessionToken = signSessionToken(result.user);
    const successUrl = new URL("/", origin);
    successUrl.searchParams.set("google_auth", "success");

    const response = NextResponse.redirect(successUrl);
    response.cookies.delete(GOOGLE_STATE_COOKIE);
    response.cookies.set(AUTH_SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: origin.startsWith("https://"),
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (err) {
    console.error("Google OAuth callback unexpected error:", err);
    return redirectWithError(origin, "oauth_failed");
  }
}
