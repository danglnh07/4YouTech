import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";
import { SEED_USERS } from "@/lib/store";

export async function GET() {
  try {
    const pool = await getDbPool();
    const result = await pool.request().query("SELECT * FROM dbo.Users ORDER BY CreatedAt DESC");

    if (result.recordset.length === 0) {
      return NextResponse.json({ source: "seed", data: SEED_USERS });
    }

    const users = result.recordset.map((row: any) => ({
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

    return NextResponse.json({ source: "mssql", data: users });
  } catch (error: any) {
    return NextResponse.json({ source: "fallback", data: SEED_USERS, error: error.message });
  }
}

export async function POST(request: Request) {
  try {
    const user = await request.json();
    const pool = await getDbPool();

    const query = `
      IF EXISTS (SELECT 1 FROM dbo.Users WHERE Email = @Email OR UserId = @UserId)
      BEGIN
        UPDATE dbo.Users
        SET Name = @Name,
            PasswordHash = ISNULL(@PasswordHash, PasswordHash),
            Role = @Role,
            Phone = @Phone,
            SkillsJson = @SkillsJson,
            AvatarUrl = @AvatarUrl,
            Status = @Status
        WHERE Email = @Email OR UserId = @UserId;
      END
      ELSE
      BEGIN
        INSERT INTO dbo.Users (UserId, Name, Email, PasswordHash, Role, Phone, SkillsJson, AvatarUrl, Status)
        VALUES (@UserId, @Name, @Email, @PasswordHash, @Role, @Phone, @SkillsJson, @AvatarUrl, @Status);
      END
    `;

    const req = pool.request();
    req.input("UserId", user.id);
    req.input("Name", user.name || "");
    req.input("Email", user.email);
    req.input("PasswordHash", user.password || null);
    req.input("Role", user.role || "customer");
    req.input("Phone", user.phone || null);
    req.input("SkillsJson", user.skills ? JSON.stringify(user.skills) : null);
    req.input("AvatarUrl", user.avatar || null);
    req.input("Status", user.status || "pending_otp");

    await req.query(query);

    return NextResponse.json({ success: true, message: `Đã lưu tài khoản ${user.email} (Status: ${user.status}) vào SQL Server!` });
  } catch (error: any) {
    console.error("Failed to save user to SQL Server:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
