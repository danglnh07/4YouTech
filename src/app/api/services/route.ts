import { NextResponse } from "next/server";
import { queryDb } from "@/lib/db";
import { SEED_SERVICES } from "@/lib/store";

export async function GET() {
  try {
    const rows = await queryDb<any>(`SELECT * FROM "Services" ORDER BY "CreatedAt" DESC`);
    if (rows && rows.length > 0) {
      const services = rows.map((row: any) => ({
        id: row.ServiceId || row.serviceid,
        name: row.Name || row.name,
        description: row.Description || row.description,
        category: row.Category || row.category,
        estimatedDays: row.EstimatedDays ?? row.estimateddays,
        maxDays: row.MaxDays ?? row.maxdays,
        estimatedPrice: row.EstimatedPrice || row.estimatedprice ? parseFloat(row.EstimatedPrice || row.estimatedprice) : null,
        maxPrice: row.MaxPrice || row.maxprice ? parseFloat(row.MaxPrice || row.maxprice) : null,
        maxRevisions: row.MaxRevisions ?? row.maxrevisions ?? 3,
        scopeOutput: row.ScopeOutput || row.scopeoutput || "",
        supportType: row.SupportType || row.supporttype || "Online",
        hidden: Boolean(row.IsHidden ?? row.ishidden),
        demoImages: (row.DemoImagesJson || row.demoimagesjson) ? JSON.parse(row.DemoImagesJson || row.demoimagesjson) : []
      }));
      return NextResponse.json({ source: "db", data: services });
    }
  } catch (error) {
    console.warn("DB fetch services error:", error);
  }

  return NextResponse.json({ source: "seed", data: SEED_SERVICES });
}

export async function POST(request: Request) {
  try {
    const srv = await request.json();

    const existing = await queryDb<any>(
      `SELECT 1 FROM "Services" WHERE "ServiceId" = ?`,
      [srv.id]
    );

    if (existing && existing.length > 0) {
      await queryDb(
        `UPDATE "Services" SET
          "Name" = ?,
          "Description" = ?,
          "Category" = ?,
          "EstimatedDays" = ?,
          "MaxDays" = ?,
          "EstimatedPrice" = ?,
          "MaxPrice" = ?,
          "MaxRevisions" = ?,
          "ScopeOutput" = ?,
          "SupportType" = ?,
          "IsHidden" = ?,
          "DemoImagesJson" = ?
         WHERE "ServiceId" = ?`,
        [
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
          srv.demoImages ? JSON.stringify(srv.demoImages) : null,
          srv.id
        ]
      );
    } else {
      await queryDb(
        `INSERT INTO "Services" ("ServiceId", "Name", "Description", "Category", "EstimatedDays", "MaxDays", "EstimatedPrice", "MaxPrice", "MaxRevisions", "ScopeOutput", "SupportType", "IsHidden", "DemoImagesJson")
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
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
        ]
      );
    }

    return NextResponse.json({
      success: true,
      message: `Đã lưu gói dịch vụ ${srv.name} vào Database!`
    });
  } catch (error: any) {
    console.error("Error saving service to DB:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


