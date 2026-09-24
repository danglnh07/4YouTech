import { NextResponse } from "next/server";
import { mysqlPool, getDbPool } from "@/lib/db";
import { SEED_REVIEWS } from "@/lib/store";

export async function GET() {
  const dbType = (process.env.DB_TYPE || "mysql").toLowerCase();

  try {
    const [rows]: any = await mysqlPool.query("SELECT * FROM ServiceReviews ORDER BY CreatedAt DESC");
    if (rows && rows.length > 0) {
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
      return NextResponse.json({ source: "mysql_workbench", data: reviews });
    }
  } catch (mysqlError) {
    if (dbType === "mssql") {
      try {
        const pool = await getDbPool();
        const result = await pool.request().query("SELECT * FROM dbo.ServiceReviews ORDER BY CreatedAt DESC");
        if (result.recordset.length > 0) {
          const reviews = result.recordset.map((row: any) => ({
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
          return NextResponse.json({ source: "mssql", data: reviews });
        }
      } catch (mssqlError) {
        console.warn("MSSQL fetch reviews fallback error:", mssqlError);
      }
    }
  }

  return NextResponse.json({ source: "seed", data: SEED_REVIEWS });
}

export async function POST(request: Request) {
  try {
    const rev = await request.json();

    try {
      const sqlQuery = `
        INSERT INTO ServiceReviews (ReviewId, OrderId, ServiceId, ServiceName, CustomerName, Rating, Comment, Moderated, ReplyText, RepliedBy, RepliedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          Rating = VALUES(Rating),
          Comment = VALUES(Comment),
          Moderated = VALUES(Moderated),
          ReplyText = VALUES(ReplyText),
          RepliedBy = VALUES(RepliedBy),
          RepliedAt = VALUES(RepliedAt);
      `;
      const params = [
        rev.id,
        rev.orderId || "",
        rev.serviceId || "",
        rev.serviceName || "",
        rev.customerName || "",
        rev.rating || 5,
        rev.comment || "",
        rev.moderated ? 1 : 0,
        rev.replyText || null,
        rev.repliedBy || null,
        rev.repliedAt || null
      ];

      await mysqlPool.execute(sqlQuery, params);
      return NextResponse.json({ success: true, message: `Đã lưu đánh giá ${rev.id} vào MySQL Workbench DB!` });
    } catch (mysqlErr: any) {
      const pool = await getDbPool();
      const query = `
        IF EXISTS (SELECT 1 FROM dbo.ServiceReviews WHERE ReviewId = @ReviewId)
        BEGIN
          UPDATE dbo.ServiceReviews
          SET Rating = @Rating,
              Comment = @Comment,
              Moderated = @Moderated,
              ReplyText = @ReplyText,
              RepliedBy = @RepliedBy,
              RepliedAt = @RepliedAt
          WHERE ReviewId = @ReviewId;
        END
        ELSE
        BEGIN
          INSERT INTO dbo.ServiceReviews (ReviewId, OrderId, ServiceName, CustomerName, Rating, Comment, Moderated, ReplyText, RepliedBy, RepliedAt)
          VALUES (@ReviewId, @OrderId, @ServiceName, @CustomerName, @Rating, @Comment, @Moderated, @ReplyText, @RepliedBy, @RepliedAt);
        END
      `;

      const req = pool.request();
      req.input("ReviewId", rev.id);
      req.input("OrderId", rev.orderId || "");
      req.input("ServiceName", rev.serviceName || "");
      req.input("CustomerName", rev.customerName || "");
      req.input("Rating", rev.rating || 5);
      req.input("Comment", rev.comment || "");
      req.input("Moderated", rev.moderated ? 1 : 0);
      req.input("ReplyText", rev.replyText || null);
      req.input("RepliedBy", rev.repliedBy || null);
      req.input("RepliedAt", rev.repliedAt || null);

      await req.query(query);
      return NextResponse.json({ success: true, message: `Đã lưu đánh giá ${rev.id} vào SQL Server!` });
    }
  } catch (error: any) {
    console.error("Error saving review to DB:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
