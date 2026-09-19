import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";
import { SEED_SERVICES } from "@/lib/store";

export async function GET() {
  try {
    const pool = await getDbPool();
    const result = await pool.request().query("SELECT * FROM dbo.Services ORDER BY CreatedAt DESC");
    
    if (result.recordset.length === 0) {
      return NextResponse.json({ source: "seed", data: SEED_SERVICES });
    }

    const services = result.recordset.map((row: any) => ({
      id: row.ServiceId,
      name: row.Name,
      description: row.Description,
      category: row.Category,
      estimatedDays: row.EstimatedDays,
      estimatedPrice: row.EstimatedPrice ? parseFloat(row.EstimatedPrice) : null,
      maxRevisions: row.MaxRevisions,
      scopeOutput: row.ScopeOutput,
      supportType: row.SupportType,
      hidden: row.IsHidden,
      demoImages: row.DemoImagesJson ? JSON.parse(row.DemoImagesJson) : []
    }));

    return NextResponse.json({ source: "mssql", data: services });
  } catch (error: any) {
    return NextResponse.json({ source: "fallback", data: SEED_SERVICES, error: error.message });
  }
}
