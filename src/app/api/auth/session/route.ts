import { NextRequest, NextResponse } from "next/server";
import { queryDb } from "@/lib/db";
import type { Role, UserStatus } from "@/lib/store";
import {
  AUTH_SESSION_COOKIE,
  getGoogleOAuthConfig,
  verifySessionToken,
  type SessionUserPayload
} from "@/lib/google-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { isConfigured, origin, redirectUri } = getGoogleOAuthConfig(request);
  const rawToken = request.cookies.get(AUTH_SESSION_COOKIE)?.value;
  const sessionUser = verifySessionToken(rawToken);

  if (!sessionUser) {
    return NextResponse.json(
      {
        configured: isConfigured,
        origin,
        redirectUri,
        user: null
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  let resolvedUser: SessionUserPayload | null = sessionUser;

  try {
    const rows = await queryDb<Record<string, string | null | undefined>>(
      `SELECT * FROM "Users" WHERE "UserId" = ? OR LOWER("Email") = ? LIMIT 1`,
      [sessionUser.id, sessionUser.email.toLowerCase()]
    );
    if (rows && rows.length > 0) {
      const row = rows[0];
      const status = (row.Status || row.status || "active") as UserStatus;
      if (status === "locked") {
        resolvedUser = null;
      } else {
        const rawSkills = row.SkillsJson || row.skillsjson;
        let skills: string[] = [];
        if (rawSkills) {
          try {
            skills = JSON.parse(rawSkills);
          } catch {
            skills = [];
          }
        }
        resolvedUser = {
          id: row.UserId || row.userid || sessionUser.id,
          name: row.Name || row.name || sessionUser.name,
          email: row.Email || row.email || sessionUser.email,
          role: (row.Role || row.role || sessionUser.role) as Role,
          phone: row.Phone || row.phone || "",
          avatar: row.AvatarUrl || row.avatarurl || sessionUser.avatar || "",
          skills,
          status,
          authProvider: "google"
        };
      }
    }
  } catch {
    // Keep verified signed cookie payload when DB is unavailable
  }

  const response = NextResponse.json(
    {
      configured: isConfigured,
      origin,
      redirectUri,
      user: resolvedUser
    },
    { headers: { "Cache-Control": "no-store" } }
  );

  if (!resolvedUser) {
    response.cookies.delete(AUTH_SESSION_COOKIE);
  }

  return response;
}

export async function DELETE() {
  const response = NextResponse.json(
    { success: true },
    { headers: { "Cache-Control": "no-store" } }
  );
  response.cookies.delete(AUTH_SESSION_COOKIE);
  return response;
}
