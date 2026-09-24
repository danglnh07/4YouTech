import { NextResponse } from "next/server";
import { mysqlPool, getDbPool } from "@/lib/db";
import { SEED_SERVICES } from "@/lib/store";

export async function GET() {
  const dbType = (process.env.DB_TYPE || "mysql").toLowerCase();

  // Try MySQL Workbench first
  try {
    const [rows]: any = await mysqlPool.query("SELECT * FROM Services ORDER BY CreatedAt DESC");
    if (rows && rows.length > 0) {
      const services = rows.map((row: any) => ({
        id: row.ServiceId,
        name: row.Name,
        description: row.Description,
        category: row.Category,
        estimatedDays: row.EstimatedDays,
        maxDays: row.MaxDays,
        estimatedPrice: row.EstimatedPrice ? parseFloat(row.EstimatedPrice) : null,
        maxPrice: row.MaxPrice ? parseFloat(row.MaxPrice) : null,
        maxRevisions: row.MaxRevisions,
        scopeOutput: row.ScopeOutput,
        supportType: row.SupportType || "Online",
        hidden: Boolean(row.IsHidden),
        demoImages: row.DemoImagesJson ? JSON.parse(row.DemoImagesJson) : []
      }));
      return NextResponse.json({ source: "mysql_workbench", data: services });
    }
  } catch (mysqlError) {
    if (dbType === "mssql") {
      try {
        const pool = await getDbPool();
        const result = await pool.request().query("SELECT * FROM dbo.Services ORDER BY CreatedAt DESC");
        if (result.recordset.length > 0) {
          const services = result.recordset.map((row: any) => ({
            id: row.ServiceId,
            name: row.Name,
            description: row.Description,
            category: row.Category,
            estimatedDays: row.EstimatedDays,
            maxDays: row.MaxDays,
            estimatedPrice: row.EstimatedPrice ? parseFloat(row.EstimatedPrice) : null,
            maxPrice: row.MaxPrice ? parseFloat(row.MaxPrice) : null,
            maxRevisions: row.MaxRevisions,
            scopeOutput: row.ScopeOutput,
            supportType: row.SupportType || "Online",
            hidden: Boolean(row.IsHidden),
            demoImages: row.DemoImagesJson ? JSON.parse(row.DemoImagesJson) : []
          }));
          return NextResponse.json({ source: "mssql", data: services });
        }
      } catch (mssqlError) {
        console.warn("MSSQL fetch services fallback error:", mssqlError);
      }
    }
  }

  return NextResponse.json({ source: "seed", data: SEED_SERVICES });
}

export async function POST(request: Request) {
  try {
    const srv = await request.json();

    try {
      const sqlQuery = `
        INSERT INTO Services (ServiceId, Name, Description, Category, EstimatedDays, MaxDays, EstimatedPrice, MaxPrice, MaxRevisions, ScopeOutput, SupportType, IsHidden, DemoImagesJson)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          Name = VALUES(Name),
          Description = VALUES(Description),
          Category = VALUES(Category),
          EstimatedDays = VALUES(EstimatedDays),
          MaxDays = VALUES(MaxDays),
          EstimatedPrice = VALUES(EstimatedPrice),
          MaxPrice = VALUES(MaxPrice),
          MaxRevisions = VALUES(MaxRevisions),
          ScopeOutput = VALUES(ScopeOutput),
          SupportType = VALUES(SupportType),
          IsHidden = VALUES(IsHidden),
          DemoImagesJson = VALUES(DemoImagesJson);
      `;
      const params = [
        srv.id,
        srv.name || "",
        srv.description || "",
        srv.category || "IT",
        srv.estimatedDays || null,
        srv.maxDays || null,
        srv.estimatedPrice || null,
        srv.maxPrice || null,
        srv.maxRevisions || 3,
        srv.scopeOutput || "",
        srv.supportType || "Online",
        srv.hidden ? 1 : 0,
        srv.demoImages ? JSON.stringify(srv.demoImages) : null
      ];
      await mysqlPool.execute(sqlQuery, params);
      return NextResponse.json({ success: true, message: `Đã lưu gói dịch vụ ${srv.name} vào MySQL Workbench DB!` });
    } catch (mysqlErr: any) {
      const pool = await getDbPool();
      const query = `
        IF EXISTS (SELECT 1 FROM dbo.Services WHERE ServiceId = @ServiceId)
        BEGIN
          UPDATE dbo.Services
          SET Name = @Name,
              Description = @Description,
              Category = @Category,
              EstimatedDays = @EstimatedDays,
              MaxDays = @MaxDays,
              EstimatedPrice = @EstimatedPrice,
              MaxPrice = @MaxPrice,
              MaxRevisions = @MaxRevisions,
              ScopeOutput = @ScopeOutput,
              SupportType = @SupportType,
              IsHidden = @IsHidden,
              DemoImagesJson = @DemoImagesJson
          WHERE ServiceId = @ServiceId;
        END
        ELSE
        BEGIN
          INSERT INTO dbo.Services (ServiceId, Name, Description, Category, EstimatedDays, MaxDays, EstimatedPrice, MaxPrice, MaxRevisions, ScopeOutput, SupportType, IsHidden, DemoImagesJson)
          VALUES (@ServiceId, @Name, @Description, @Category, @EstimatedDays, @MaxDays, @EstimatedPrice, @MaxPrice, @MaxRevisions, @ScopeOutput, @SupportType, @IsHidden, @DemoImagesJson);
        END
      `;
      const req = pool.request();
      req.input("ServiceId", srv.id);
      req.input("Name", srv.name || "");
      req.input("Description", srv.description || "");
      req.input("Category", srv.category || "IT");
      req.input("EstimatedDays", srv.estimatedDays || null);
      req.input("MaxDays", srv.maxDays || null);
      req.input("EstimatedPrice", srv.estimatedPrice || null);
      req.input("MaxPrice", srv.maxPrice || null);
      req.input("MaxRevisions", srv.maxRevisions || 3);
      req.input("ScopeOutput", srv.scopeOutput || "");
      req.input("SupportType", srv.supportType || "Online");
      req.input("IsHidden", srv.hidden ? 1 : 0);
      req.input("DemoImagesJson", srv.demoImages ? JSON.stringify(srv.demoImages) : null);

      await req.query(query);
      return NextResponse.json({ success: true, message: `Đã lưu gói dịch vụ ${srv.name} vào SQL Server!` });
    }
  } catch (error: any) {
    console.error("Error saving service to DB:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
