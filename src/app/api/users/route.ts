import { NextResponse } from "next/server";
import { queryDb } from "@/lib/db";
import { SEED_USERS } from "@/lib/store";

export async function GET() {
  try {
    const rows = await queryDb<any>(`SELECT * FROM "Users" ORDER BY "CreatedAt" DESC`);
    if (rows && rows.length > 0) {
      const users = rows.map((row: any) => ({
        id: row.UserId || row.userid,
        name: row.Name || row.name,
        email: row.Email || row.email,
        password: row.PasswordHash || row.passwordhash,
        role: row.Role || row.role,
        phone: row.Phone || row.phone || "",
        avatar: row.AvatarUrl || row.avatarurl || "",
        status: row.Status || row.status || "active",
        skills: row.SkillsJson || row.skillsjson ? JSON.parse(row.SkillsJson || row.skillsjson) : []
      }));
      return NextResponse.json({ source: "db", data: users });
    }
  } catch (error) {
    console.warn("DB fetch users error:", error);
  }

  return NextResponse.json({ source: "seed", data: SEED_USERS });
}


export async function POST(request: Request) {
  try {
    const user = await request.json();

    const existing = await queryDb<any>(
      `SELECT 1 FROM "Users" WHERE "UserId" = ?`,
      [user.id]
    );

    if (existing && existing.length > 0) {
      await queryDb(
        `UPDATE "Users" SET
          "Name" = ?,
          "PasswordHash" = COALESCE(?, "PasswordHash"),
          "Role" = ?,
          "Phone" = ?,
          "SkillsJson" = ?,
          "AvatarUrl" = ?,
          "Status" = ?
         WHERE "UserId" = ?`,
        [
          user.name || "",
          user.password || null,
          user.role || "customer",
          user.phone || null,
          user.skills ? JSON.stringify(user.skills) : null,
          user.avatar || null,
          user.status || "active",
          user.id
        ]
      );
    } else {
      await queryDb(
        `INSERT INTO "Users" ("UserId", "Name", "Email", "PasswordHash", "Role", "Phone", "SkillsJson", "AvatarUrl", "Status")
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user.id,
          user.name || "",
          user.email,
          user.password || null,
          user.role || "customer",
          user.phone || null,
          user.skills ? JSON.stringify(user.skills) : null,
          user.avatar || null,
          user.status || "pending_otp"
        ]
      );
    }

    return NextResponse.json({
      success: true,
      message: `Đã lưu tài khoản ${user.email} vào Database!`
    });
  } catch (error: any) {
    console.error("Failed to save user to Database:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


