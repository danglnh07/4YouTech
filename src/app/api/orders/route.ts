import { NextResponse } from "next/server";
import { getPgPool } from "@/lib/db";
import { SEED_ORDERS } from "@/lib/store";

export async function GET() {
  try {
    const { rows } = await getPgPool().query(`
      SELECT o.*,
        COALESCE((
          SELECT json_agg(json_build_object(
              'id', m."MessageId",
              'senderId', m."SenderId",
              'senderName', m."SenderName",
              'senderRole', m."SenderRole",
              'text', m."Text",
              'attachmentUrl', m."AttachmentUrl",
              'createdAt', m."CreatedAt"
            ) ORDER BY m."CreatedAt" ASC)
          FROM "OrderMessages" m
          WHERE m."OrderId" = o."OrderId"
        ), '[]'::json) AS "messagesJson"
      FROM "ServiceOrders" o
      ORDER BY o."CreatedAt" DESC
    `);

    if (rows.length > 0) {
      const orders = rows.map((row: any) => ({
        id: row.OrderId,
        serviceId: row.ServiceId,
        serviceName: row.ServiceName,
        category: row.Category,
        customerId: row.CustomerId,
        customerName: row.CustomerName,
        customerEmail: row.CustomerEmail,
        customerPhone: row.CustomerPhone,
        requirements: row.Requirements,
        attachments: row.AttachmentsJson ? JSON.parse(row.AttachmentsJson) : [],
        desiredDeadline: row.DesiredDeadline || "",
        status: row.Status,
        progressPercent: row.ProgressPercent,
        workEstimate: row.WorkEstimateJson ? JSON.parse(row.WorkEstimateJson) : undefined,
        quotation: row.QuotationJson ? JSON.parse(row.QuotationJson) : undefined,
        paymentInfo: row.PaymentInfoJson ? JSON.parse(row.PaymentInfoJson) : undefined,
        assignedStaffId: row.AssignedStaffId,
        assignedStaffName: row.AssignedStaffName,
        collaborators: row.CollaboratorsJson ? JSON.parse(row.CollaboratorsJson) : [],
        milestones: row.MilestonesJson ? JSON.parse(row.MilestonesJson) : [],
        deliverables: row.DeliverablesJson ? JSON.parse(row.DeliverablesJson) : [],
        revisions: row.RevisionsJson ? JSON.parse(row.RevisionsJson) : [],
        supportTickets: row.SupportTicketsJson ? JSON.parse(row.SupportTicketsJson) : [],
        cancellation: row.CancellationJson ? JSON.parse(row.CancellationJson) : null,
        isBeingEdited: Boolean(row.IsBeingEdited),
        editingNote: row.EditingNote,
        messages: row.messagesJson
          ? typeof row.messagesJson === "string"
            ? JSON.parse(row.messagesJson)
            : row.messagesJson
          : [],
        createdAt: row.CreatedAt,
        updatedAt: row.UpdatedAt
      }));

      return NextResponse.json({ source: "postgres", data: orders });
    }
  } catch (error) {
    console.warn("Postgres fetch orders error:", error);
  }

  return NextResponse.json({ source: "seed", data: SEED_ORDERS });
}

export async function POST(request: Request) {
  try {
    const order = await request.json();

    const query = `
      INSERT INTO "ServiceOrders" (
        "OrderId", "ServiceId", "ServiceName", "Category", "CustomerId", "CustomerName", "CustomerEmail", "CustomerPhone",
        "Requirements", "AttachmentsJson", "DesiredDeadline", "Status", "ProgressPercent", "WorkEstimateJson", "QuotationJson",
        "PaymentInfoJson", "AssignedStaffId", "AssignedStaffName", "CollaboratorsJson", "MilestonesJson", "DeliverablesJson",
        "RevisionsJson", "SupportTicketsJson", "CancellationJson", "IsBeingEdited", "EditingNote"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
      ON CONFLICT ("OrderId") DO UPDATE SET
        "ServiceId" = EXCLUDED."ServiceId",
        "ServiceName" = EXCLUDED."ServiceName",
        "Category" = EXCLUDED."Category",
        "CustomerId" = EXCLUDED."CustomerId",
        "CustomerName" = EXCLUDED."CustomerName",
        "CustomerEmail" = EXCLUDED."CustomerEmail",
        "CustomerPhone" = EXCLUDED."CustomerPhone",
        "Requirements" = EXCLUDED."Requirements",
        "AttachmentsJson" = EXCLUDED."AttachmentsJson",
        "DesiredDeadline" = EXCLUDED."DesiredDeadline",
        "Status" = EXCLUDED."Status",
        "ProgressPercent" = EXCLUDED."ProgressPercent",
        "WorkEstimateJson" = EXCLUDED."WorkEstimateJson",
        "QuotationJson" = EXCLUDED."QuotationJson",
        "PaymentInfoJson" = EXCLUDED."PaymentInfoJson",
        "AssignedStaffId" = EXCLUDED."AssignedStaffId",
        "AssignedStaffName" = EXCLUDED."AssignedStaffName",
        "CollaboratorsJson" = EXCLUDED."CollaboratorsJson",
        "MilestonesJson" = EXCLUDED."MilestonesJson",
        "DeliverablesJson" = EXCLUDED."DeliverablesJson",
        "RevisionsJson" = EXCLUDED."RevisionsJson",
        "SupportTicketsJson" = EXCLUDED."SupportTicketsJson",
        "CancellationJson" = EXCLUDED."CancellationJson",
        "IsBeingEdited" = EXCLUDED."IsBeingEdited",
        "EditingNote" = EXCLUDED."EditingNote";
    `;

    const params = [
      order.id,
      order.serviceId || "",
      order.serviceName || "",
      order.category || "IT",
      order.customerId || "",
      order.customerName || "",
      order.customerEmail || "",
      order.customerPhone || "",
      order.requirements || "",
      order.attachments ? JSON.stringify(order.attachments) : null,
      order.desiredDeadline || null,
      order.status || "submitted",
      order.progressPercent || 0,
      order.workEstimate ? JSON.stringify(order.workEstimate) : null,
      order.quotation ? JSON.stringify(order.quotation) : null,
      order.paymentInfo ? JSON.stringify(order.paymentInfo) : null,
      order.assignedStaffId || null,
      order.assignedStaffName || null,
      order.collaborators ? JSON.stringify(order.collaborators) : null,
      order.milestones ? JSON.stringify(order.milestones) : null,
      order.deliverables ? JSON.stringify(order.deliverables) : null,
      order.revisions ? JSON.stringify(order.revisions) : null,
      order.supportTickets ? JSON.stringify(order.supportTickets) : null,
      order.cancellation ? JSON.stringify(order.cancellation) : null,
      Boolean(order.isBeingEdited),
      order.editingNote || null
    ];

    await getPgPool().query(query, params);

    // Save Order Messages
    if (order.messages && order.messages.length > 0) {
      for (const msg of order.messages) {
        await getPgPool().query(
          `INSERT INTO "OrderMessages" ("MessageId", "OrderId", "SenderId", "SenderName", "SenderRole", "Text", "AttachmentUrl")
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT ("MessageId") DO UPDATE SET
             "Text" = EXCLUDED."Text",
             "AttachmentUrl" = EXCLUDED."AttachmentUrl";`,
          [
            msg.id || `msg-${Date.now()}`,
            order.id,
            msg.senderId || "",
            msg.senderName || "",
            msg.senderRole || "customer",
            msg.text || "",
            msg.attachmentUrl || null
          ]
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: `Đã lưu đơn hàng ${order.id} vào PostgreSQL!`
    });
  } catch (error: any) {
    console.error("Error saving order to DB:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
