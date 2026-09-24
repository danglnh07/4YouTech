import { NextResponse } from "next/server";
import { getPgPool } from "@/lib/db";
import { SEED_SERVICES } from "@/lib/store";

export async function GET() {
  try {
    const { rows } = await getPgPool().query(
      `SELECT * FROM "Services" ORDER BY "CreatedAt" DESC`
    );
    if (rows.length > 0) {
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
      return NextResponse.json({ source: "postgres", data: services });
    }
  } catch (error) {
    console.warn("Postgres fetch services error:", error);
  }

  return NextResponse.json({ source: "seed", data: SEED_SERVICES });
}

export async function POST(request: Request) {
  try {
    const srv = await request.json();

    const query = `
      INSERT INTO "Services" ("ServiceId", "Name", "Description", "Category", "EstimatedDays", "MaxDays", "EstimatedPrice", "MaxPrice", "MaxRevisions", "ScopeOutput", "SupportType", "IsHidden", "DemoImagesJson")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT ("ServiceId") DO UPDATE SET
        "Name" = EXCLUDED."Name",
        "Description" = EXCLUDED."Description",
        "Category" = EXCLUDED."Category",
        "EstimatedDays" = EXCLUDED."EstimatedDays",
        "MaxDays" = EXCLUDED."MaxDays",
        "EstimatedPrice" = EXCLUDED."EstimatedPrice",
        "MaxPrice" = EXCLUDED."MaxPrice",
        "MaxRevisions" = EXCLUDED."MaxRevisions",
        "ScopeOutput" = EXCLUDED."ScopeOutput",
        "SupportType" = EXCLUDED."SupportType",
        "IsHidden" = EXCLUDED."IsHidden",
        "DemoImagesJson" = EXCLUDED."DemoImagesJson";
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
      Boolean(srv.hidden),
      srv.demoImages ? JSON.stringify(srv.demoImages) : null
    ];
    await getPgPool().query(query, params);
    return NextResponse.json({
      success: true,
      message: `Đã lưu gói dịch vụ ${srv.name} vào PostgreSQL!`
    });
  } catch (error: any) {
    console.error("Error saving service to DB:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
