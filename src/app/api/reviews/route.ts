import { NextResponse } from "next/server";
import { getPgPool } from "@/lib/db";
import { SEED_REVIEWS } from "@/lib/store";

export async function GET() {
  try {
    const { rows } = await getPgPool().query(
      `SELECT * FROM "ServiceReviews" ORDER BY "CreatedAt" DESC`
    );
    if (rows.length > 0) {
      const reviews = rows.map((row: any) => ({
        id: row.ReviewId,
        orderId: row.OrderId,
        serviceName: row.ServiceName,
        customerName: row.CustomerName,
        rating: row.Rating,
        comment: row.Comment,
        moderated: Boolean(row.Moderated),
        replyText: row.ReplyText,
        repliedBy: row.RepliedBy,
        repliedAt: row.RepliedAt,
        createdAt: row.CreatedAt
      }));
      return NextResponse.json({ source: "postgres", data: reviews });
    }
  } catch (error) {
    console.warn("Postgres fetch reviews error:", error);
  }

  return NextResponse.json({ source: "seed", data: SEED_REVIEWS });
}

export async function POST(request: Request) {
  try {
    const rev = await request.json();

    const query = `
      INSERT INTO "ServiceReviews" ("ReviewId", "OrderId", "ServiceId", "ServiceName", "CustomerName", "Rating", "Comment", "Moderated", "ReplyText", "RepliedBy", "RepliedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT ("ReviewId") DO UPDATE SET
        "Rating" = EXCLUDED."Rating",
        "Comment" = EXCLUDED."Comment",
        "Moderated" = EXCLUDED."Moderated",
        "ReplyText" = EXCLUDED."ReplyText",
        "RepliedBy" = EXCLUDED."RepliedBy",
        "RepliedAt" = EXCLUDED."RepliedAt";
    `;
    const params = [
      rev.id,
      rev.orderId || "",
      rev.serviceId || "",
      rev.serviceName || "",
      rev.customerName || "",
      rev.rating || 5,
      rev.comment || "",
      Boolean(rev.moderated),
      rev.replyText || null,
      rev.repliedBy || null,
      rev.repliedAt || null
    ];

    await getPgPool().query(query, params);
    return NextResponse.json({
      success: true,
      message: `Đã lưu đánh giá ${rev.id} vào PostgreSQL!`
    });
  } catch (error: any) {
    console.error("Error saving review to DB:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
