import { NextResponse } from "next/server";
import { getPgPool } from "@/lib/db";
import { SEED_USERS } from "@/lib/store";

export async function GET() {
  try {
    const { rows } = await getPgPool().query(
      `SELECT * FROM "Users" ORDER BY "CreatedAt" DESC`
    );
    if (rows.length > 0) {
      const users = rows.map((row: any) => ({
        id: row.UserId,
        name: row.Name,
        email: row.Email,
        password: row.PasswordHash,
        role: row.Role,
        phone: row.Phone || "",
        avatar: row.AvatarUrl || "",
        status: row.Status || "active",
        skills: row.SkillsJson ? JSON.parse(row.SkillsJson) : []
      }));
      return NextResponse.json({ source: "postgres", data: users });
    }
  } catch (error) {
    console.warn("Postgres fetch users error:", error);
  }

  return NextResponse.json({ source: "seed", data: SEED_USERS });
}

export async function POST(request: Request) {
  try {
    const user = await request.json();

    const query = `
      INSERT INTO "Users" ("UserId", "Name", "Email", "PasswordHash", "Role", "Phone", "SkillsJson", "AvatarUrl", "Status")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT ("UserId") DO UPDATE SET
        "Name" = EXCLUDED."Name",
        "PasswordHash" = COALESCE(EXCLUDED."PasswordHash", "Users"."PasswordHash"),
        "Role" = EXCLUDED."Role",
        "Phone" = EXCLUDED."Phone",
        "SkillsJson" = EXCLUDED."SkillsJson",
        "AvatarUrl" = EXCLUDED."AvatarUrl",
        "Status" = EXCLUDED."Status";
    `;
    const params = [
      user.id,
      user.name || "",
      user.email,
      user.password || null,
      user.role || "customer",
      user.phone || null,
      user.skills ? JSON.stringify(user.skills) : null,
      user.avatar || null,
      user.status || "pending_otp"
    ];
    await getPgPool().query(query, params);
    return NextResponse.json({
      success: true,
      message: `Đã lưu tài khoản ${user.email} vào PostgreSQL!`
    });
  } catch (error: any) {
    console.error("Failed to save user to Database:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
