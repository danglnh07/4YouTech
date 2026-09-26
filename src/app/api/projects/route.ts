import { NextResponse } from "next/server";
import { queryDb } from "@/lib/db";
import { SEED_PROJECTS } from "@/lib/store";

export async function GET() {
  try {
    const rows = await queryDb<any>(`SELECT * FROM "SampleProjects" ORDER BY "CreatedAt" DESC`);
    if (rows && rows.length > 0) {
      const projects = rows.map((row: any) => ({
        id: row.ProjectId || row.projectid,
        name: row.Name || row.name,
        category: row.Category || row.category,
        subCategory: row.SubCategory || row.subcategory,
        description: row.Description || row.description,
        image: row.ImageUrl || row.imageurl,
        link: row.DemoLink || row.demolink,
        featured: Boolean(row.IsFeatured ?? row.isfeatured)
      }));
      return NextResponse.json({ source: "db", data: projects });
    }
  } catch (error) {
    console.warn("DB fetch projects error:", error);
  }

  return NextResponse.json({ source: "seed", data: SEED_PROJECTS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === "delete") {
      await queryDb(`DELETE FROM "SampleProjects" WHERE "ProjectId" = ?`, [body.id]);
      return NextResponse.json({
        success: true,
        message: `Đã xóa dự án mẫu ${body.id} khỏi Database!`
      });
    }

    const existing = await queryDb<any>(
      `SELECT 1 FROM "SampleProjects" WHERE "ProjectId" = ?`,
      [body.id]
    );

    if (existing && existing.length > 0) {
      await queryDb(
        `UPDATE "SampleProjects" SET
          "Name" = ?,
          "Category" = ?,
          "SubCategory" = ?,
          "Description" = ?,
          "ImageUrl" = ?,
          "DemoLink" = ?,
          "IsFeatured" = ?
         WHERE "ProjectId" = ?`,
        [
          body.name || "",
          body.category || "IT",
          body.subCategory || body.category || "IT",
          body.description || "",
          body.image || "",
          body.link || "",
          Boolean(body.featured),
          body.id
        ]
      );
    } else {
      await queryDb(
        `INSERT INTO "SampleProjects" ("ProjectId", "Name", "Category", "SubCategory", "Description", "ImageUrl", "DemoLink", "IsFeatured")
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          body.id,
          body.name || "",
          body.category || "IT",
          body.subCategory || body.category || "IT",
          body.description || "",
          body.image || "",
          body.link || "",
          Boolean(body.featured)
        ]
      );
    }

    return NextResponse.json({
      success: true,
      message: `Đã lưu dự án mẫu ${body.name} vào Database!`
    });
  } catch (error: any) {
    console.error("Error saving project to DB:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


