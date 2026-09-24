import { NextResponse } from "next/server";
import { mysqlPool, getDbPool } from "@/lib/db";
import { SEED_USERS } from "@/lib/store";

export async function GET() {
  const dbType = (process.env.DB_TYPE || "mysql").toLowerCase();
  
  // Try MySQL Workbench first
  try {
    const [rows]: any = await mysqlPool.query("SELECT * FROM Users ORDER BY CreatedAt DESC");
    if (rows && rows.length > 0) {
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
      return NextResponse.json({ source: "mysql_workbench", data: users });
    }
  } catch (mysqlError) {
    // Fallback to MSSQL if configured
    if (dbType === "mssql") {
      try {
        const pool = await getDbPool();
        const result = await pool.request().query("SELECT * FROM dbo.Users ORDER BY CreatedAt DESC");
        if (result.recordset.length > 0) {
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
        }
      } catch (mssqlError) {
        console.warn("MSSQL fetch users fallback error:", mssqlError);
      }
    }
  }

  return NextResponse.json({ source: "seed", data: SEED_USERS });
}

export async function POST(request: Request) {
  try {
    const user = await request.json();

    // MySQL Workbench execution
    try {
      const sqlQuery = `
        INSERT INTO Users (UserId, Name, Email, PasswordHash, Role, Phone, SkillsJson, AvatarUrl, Status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          Name = VALUES(Name),
          PasswordHash = COALESCE(VALUES(PasswordHash), PasswordHash),
          Role = VALUES(Role),
          Phone = VALUES(Phone),
          SkillsJson = VALUES(SkillsJson),
          AvatarUrl = VALUES(AvatarUrl),
          Status = VALUES(Status);
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
      await mysqlPool.execute(sqlQuery, params);
      return NextResponse.json({ success: true, message: `Đã lưu tài khoản ${user.email} vào MySQL Workbench DB!` });
    } catch (mysqlErr: any) {
      // Fallback to MSSQL if MSSQL DB is used
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
      return NextResponse.json({ success: true, message: `Đã lưu tài khoản ${user.email} vào SQL Server!` });
    }
  } catch (error: any) {
    console.error("Failed to save user to Database:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
