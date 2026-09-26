import { NextResponse } from "next/server";
import { queryDb } from "@/lib/db";
import { SEED_REVIEWS } from "@/lib/store";

export async function GET() {
  try {
    const rows = await queryDb<any>(`SELECT * FROM "ServiceReviews" ORDER BY "CreatedAt" DESC`);
    if (rows && rows.length > 0) {
      const reviews = rows.map((row: any) => ({
        id: row.ReviewId || row.reviewid,
        orderId: row.OrderId || row.orderid,
        serviceName: row.ServiceName || row.servicename,
        customerName: row.CustomerName || row.customername,
        rating: row.Rating ?? row.rating ?? 5,
        comment: row.Comment || row.comment || "",
        moderated: Boolean(row.Moderated ?? row.moderated),
        replyText: row.ReplyText || row.replytext,
        repliedBy: row.RepliedBy || row.repliedby,
        repliedAt: row.RepliedAt || row.repliedat,
        createdAt: row.CreatedAt || row.createdat
      }));
      return NextResponse.json({ source: "db", data: reviews });
    }
  } catch (error) {
    console.warn("DB fetch reviews error:", error);
  }

  return NextResponse.json({ source: "seed", data: SEED_REVIEWS });
}

export async function POST(request: Request) {
  try {
    const rev = await request.json();

    const existing = await queryDb<any>(
      `SELECT 1 FROM "ServiceReviews" WHERE "ReviewId" = ?`,
      [rev.id]
    );

    if (existing && existing.length > 0) {
      await queryDb(
        `UPDATE "ServiceReviews" SET
          "Rating" = ?,
          "Comment" = ?,
          "Moderated" = ?,
          "ReplyText" = ?,
          "RepliedBy" = ?,
          "RepliedAt" = ?
         WHERE "ReviewId" = ?`,
        [
          rev.rating || 5,
          rev.comment || "",
          Boolean(rev.moderated),
          rev.replyText || null,
          rev.repliedBy || null,
          rev.repliedAt || null,
          rev.id
        ]
      );
    } else {
      await queryDb(
        `INSERT INTO "ServiceReviews" ("ReviewId", "OrderId", "ServiceId", "ServiceName", "CustomerName", "Rating", "Comment", "Moderated", "ReplyText", "RepliedBy", "RepliedAt")
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
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
        ]
      );
    }

    return NextResponse.json({
      success: true,
      message: `Đã lưu đánh giá ${rev.id} vào Database!`
    });
  } catch (error: any) {
    console.error("Error saving review to DB:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


