import { NextResponse } from "next/server";
import { mysqlPool, getDbPool } from "@/lib/db";
import { SEED_PROJECTS } from "@/lib/store";

export async function GET() {
  const dbType = (process.env.DB_TYPE || "mysql").toLowerCase();

  try {
    const [rows]: any = await mysqlPool.query("SELECT * FROM SampleProjects ORDER BY CreatedAt DESC");
    if (rows && rows.length > 0) {
      const projects = rows.map((row: any) => ({
        id: row.ProjectId,
        name: row.Name,
        category: row.Category,
        subCategory: row.SubCategory,
        description: row.Description,
        image: row.ImageUrl,
        link: row.DemoLink,
        featured: Boolean(row.IsFeatured)
      }));
      return NextResponse.json({ source: "mysql_workbench", data: projects });
    }
  } catch (mysqlError) {
    if (dbType === "mssql") {
      try {
        const pool = await getDbPool();
        const result = await pool.request().query("SELECT * FROM dbo.SampleProjects ORDER BY CreatedAt DESC");
        if (result.recordset.length > 0) {
          const projects = result.recordset.map((row: any) => ({
            id: row.ProjectId,
            name: row.Name,
            category: row.Category,
            subCategory: row.SubCategory,
            description: row.Description,
            image: row.ImageUrl,
            link: row.DemoLink,
            featured: Boolean(row.IsFeatured)
          }));
          return NextResponse.json({ source: "mssql", data: projects });
        }
      } catch (mssqlError) {
        console.warn("MSSQL fetch projects fallback error:", mssqlError);
      }
    }
  }

  return NextResponse.json({ source: "seed", data: SEED_PROJECTS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    try {
      if (body.action === "delete") {
        await mysqlPool.execute("DELETE FROM SampleProjects WHERE ProjectId = ?", [body.id]);
        return NextResponse.json({ success: true, message: `Đã xóa dự án mẫu ${body.id} khỏi MySQL Workbench DB!` });
      }

      const sqlQuery = `
        INSERT INTO SampleProjects (ProjectId, Name, Category, SubCategory, Description, ImageUrl, DemoLink, IsFeatured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          Name = VALUES(Name),
          Category = VALUES(Category),
          SubCategory = VALUES(SubCategory),
          Description = VALUES(Description),
          ImageUrl = VALUES(ImageUrl),
          DemoLink = VALUES(DemoLink),
          IsFeatured = VALUES(IsFeatured);
      `;
      const params = [
        body.id,
        body.name || "",
        body.category || "IT",
        body.subCategory || body.category || "IT",
        body.description || "",
        body.image || "",
        body.link || "",
        body.featured ? 1 : 0
      ];
      await mysqlPool.execute(sqlQuery, params);
      return NextResponse.json({ success: true, message: `Đã lưu dự án mẫu ${body.name} vào MySQL Workbench DB!` });
    } catch (mysqlErr: any) {
      const pool = await getDbPool();

      if (body.action === "delete") {
        const req = pool.request();
        req.input("ProjectId", body.id);
        await req.query("DELETE FROM dbo.SampleProjects WHERE ProjectId = @ProjectId");
        return NextResponse.json({ success: true, message: `Đã xóa dự án mẫu ${body.id} khỏi SQL Server!` });
      }

      const query = `
        IF EXISTS (SELECT 1 FROM dbo.SampleProjects WHERE ProjectId = @ProjectId)
        BEGIN
          UPDATE dbo.SampleProjects
          SET Name = @Name,
              Category = @Category,
              SubCategory = @SubCategory,
              Description = @Description,
              ImageUrl = @ImageUrl,
              DemoLink = @DemoLink,
              IsFeatured = @IsFeatured
          WHERE ProjectId = @ProjectId;
        END
        ELSE
        BEGIN
          INSERT INTO dbo.SampleProjects (ProjectId, Name, Category, SubCategory, Description, ImageUrl, DemoLink, IsFeatured)
          VALUES (@ProjectId, @Name, @Category, @SubCategory, @Description, @ImageUrl, @DemoLink, @IsFeatured);
        END
      `;

      const req = pool.request();
      req.input("ProjectId", body.id);
      req.input("Name", body.name || "");
      req.input("Category", body.category || "IT");
      req.input("SubCategory", body.subCategory || body.category || "IT");
      req.input("Description", body.description || "");
      req.input("ImageUrl", body.image || "");
      req.input("DemoLink", body.link || "");
      req.input("IsFeatured", body.featured ? 1 : 0);

      await req.query(query);
      return NextResponse.json({ success: true, message: `Đã lưu dự án mẫu ${body.name} vào SQL Server!` });
    }
  } catch (error: any) {
    console.error("Error saving project to DB:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
