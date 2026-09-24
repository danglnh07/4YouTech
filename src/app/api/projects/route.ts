import { NextResponse } from "next/server";
import { getPgPool } from "@/lib/db";
import { SEED_PROJECTS } from "@/lib/store";

export async function GET() {
  try {
    const { rows } = await getPgPool().query(
      `SELECT * FROM "SampleProjects" ORDER BY "CreatedAt" DESC`
    );
    if (rows.length > 0) {
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
      return NextResponse.json({ source: "postgres", data: projects });
    }
  } catch (error) {
    console.warn("Postgres fetch projects error:", error);
  }

  return NextResponse.json({ source: "seed", data: SEED_PROJECTS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === "delete") {
      await getPgPool().query(
        `DELETE FROM "SampleProjects" WHERE "ProjectId" = $1`,
        [body.id]
      );
      return NextResponse.json({
        success: true,
        message: `Đã xóa dự án mẫu ${body.id} khỏi PostgreSQL!`
      });
    }

    const query = `
      INSERT INTO "SampleProjects" ("ProjectId", "Name", "Category", "SubCategory", "Description", "ImageUrl", "DemoLink", "IsFeatured")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT ("ProjectId") DO UPDATE SET
        "Name" = EXCLUDED."Name",
        "Category" = EXCLUDED."Category",
        "SubCategory" = EXCLUDED."SubCategory",
        "Description" = EXCLUDED."Description",
        "ImageUrl" = EXCLUDED."ImageUrl",
        "DemoLink" = EXCLUDED."DemoLink",
        "IsFeatured" = EXCLUDED."IsFeatured";
    `;
    const params = [
      body.id,
      body.name || "",
      body.category || "IT",
      body.subCategory || body.category || "IT",
      body.description || "",
      body.image || "",
      body.link || "",
      Boolean(body.featured)
    ];
    await getPgPool().query(query, params);
    return NextResponse.json({
      success: true,
      message: `Đã lưu dự án mẫu ${body.name} vào PostgreSQL!`
    });
  } catch (error: any) {
    console.error("Error saving project to DB:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
