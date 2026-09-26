import { NextResponse } from "next/server";
import { queryDb } from "@/lib/db";
import { SEED_ORDERS } from "@/lib/store";

export async function GET() {
  try {
    const rows = await queryDb<any>(`SELECT * FROM "ServiceOrders" ORDER BY "CreatedAt" DESC`);
    const allMessages = await queryDb<any>(`SELECT * FROM "OrderMessages" ORDER BY "CreatedAt" ASC`);

    if (rows && rows.length > 0) {
      const orders = rows.map((row: any) => {
        const orderId = row.OrderId || row.orderid;
        const orderMsgs = allMessages
          .filter((m: any) => (m.OrderId || m.orderid) === orderId)
          .map((m: any) => ({
            id: m.MessageId || m.messageid,
            senderId: m.SenderId || m.senderid,
            senderName: m.SenderName || m.sendername,
            senderRole: m.SenderRole || m.senderrole,
            text: m.Text || m.text,
            attachmentUrl: m.AttachmentUrl || m.attachmenturl,
            createdAt: m.CreatedAt || m.createdat
          }));

        return {
          id: orderId,
          serviceId: row.ServiceId || row.serviceid,
          serviceName: row.ServiceName || row.servicename,
          category: row.Category || row.category,
          customerId: row.CustomerId || row.customerid,
          customerName: row.CustomerName || row.customername,
          customerEmail: row.CustomerEmail || row.customeremail,
          customerPhone: row.CustomerPhone || row.customerphone,
          requirements: row.Requirements || row.requirements,
          attachments: (row.AttachmentsJson || row.attachmentsjson) ? JSON.parse(row.AttachmentsJson || row.attachmentsjson) : [],
          desiredDeadline: row.DesiredDeadline || row.desireddeadline || "",
          status: row.Status || row.status,
          progressPercent: row.ProgressPercent ?? row.progresspercent ?? 0,
          workEstimate: (row.WorkEstimateJson || row.workestimatejson) ? JSON.parse(row.WorkEstimateJson || row.workestimatejson) : undefined,
          quotation: (row.QuotationJson || row.quotationjson) ? JSON.parse(row.QuotationJson || row.quotationjson) : undefined,
          paymentInfo: (row.PaymentInfoJson || row.paymentinfojson) ? JSON.parse(row.PaymentInfoJson || row.paymentinfojson) : undefined,
          assignedStaffId: row.AssignedStaffId || row.assignedstaffid,
          assignedStaffName: row.AssignedStaffName || row.assignedstaffname,
          collaborators: (row.CollaboratorsJson || row.collaboratorsjson) ? JSON.parse(row.CollaboratorsJson || row.collaboratorsjson) : [],
          milestones: (row.MilestonesJson || row.milestonesjson) ? JSON.parse(row.MilestonesJson || row.milestonesjson) : [],
          deliverables: (row.DeliverablesJson || row.deliverablesjson) ? JSON.parse(row.DeliverablesJson || row.deliverablesjson) : [],
          revisions: (row.RevisionsJson || row.revisionsjson) ? JSON.parse(row.RevisionsJson || row.revisionsjson) : [],
          supportTickets: (row.SupportTicketsJson || row.supportticketsjson) ? JSON.parse(row.SupportTicketsJson || row.supportticketsjson) : [],
          cancellation: (row.CancellationJson || row.cancellationjson) ? JSON.parse(row.CancellationJson || row.cancellationjson) : null,
          isBeingEdited: Boolean(row.IsBeingEdited ?? row.isbeingedited),
          editingNote: row.EditingNote || row.editingnote,
          messages: orderMsgs,
          createdAt: row.CreatedAt || row.createdat,
          updatedAt: row.UpdatedAt || row.updatedat
        };
      });

      return NextResponse.json({ source: "db", data: orders });
    }
  } catch (error) {
    console.warn("DB fetch orders error:", error);
  }

  return NextResponse.json({ source: "seed", data: SEED_ORDERS });
}

export async function POST(request: Request) {
  try {
    const order = await request.json();

    const existing = await queryDb<any>(
      `SELECT 1 FROM "ServiceOrders" WHERE "OrderId" = ?`,
      [order.id]
    );

    if (existing && existing.length > 0) {
      await queryDb(
        `UPDATE "ServiceOrders" SET
          "ServiceId" = ?,
          "ServiceName" = ?,
          "Category" = ?,
          "CustomerId" = ?,
          "CustomerName" = ?,
          "CustomerEmail" = ?,
          "CustomerPhone" = ?,
          "Requirements" = ?,
          "AttachmentsJson" = ?,
          "DesiredDeadline" = ?,
          "Status" = ?,
          "ProgressPercent" = ?,
          "WorkEstimateJson" = ?,
          "QuotationJson" = ?,
          "PaymentInfoJson" = ?,
          "AssignedStaffId" = ?,
          "AssignedStaffName" = ?,
          "CollaboratorsJson" = ?,
          "MilestonesJson" = ?,
          "DeliverablesJson" = ?,
          "RevisionsJson" = ?,
          "SupportTicketsJson" = ?,
          "CancellationJson" = ?,
          "IsBeingEdited" = ?,
          "EditingNote" = ?
         WHERE "OrderId" = ?`,
        [
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
          order.editingNote || null,
          order.id
        ]
      );
    } else {
      await queryDb(
        `INSERT INTO "ServiceOrders" (
          "OrderId", "ServiceId", "ServiceName", "Category", "CustomerId", "CustomerName", "CustomerEmail", "CustomerPhone",
          "Requirements", "AttachmentsJson", "DesiredDeadline", "Status", "ProgressPercent", "WorkEstimateJson", "QuotationJson",
          "PaymentInfoJson", "AssignedStaffId", "AssignedStaffName", "CollaboratorsJson", "MilestonesJson", "DeliverablesJson",
          "RevisionsJson", "SupportTicketsJson", "CancellationJson", "IsBeingEdited", "EditingNote"
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
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
        ]
      );
    }

    // Save Order Messages
    if (order.messages && order.messages.length > 0) {
      for (const msg of order.messages) {
        const msgId = msg.id || `msg-${Date.now()}`;
        const existingMsg = await queryDb<any>(
          `SELECT 1 FROM "OrderMessages" WHERE "MessageId" = ?`,
          [msgId]
        );

        if (existingMsg && existingMsg.length > 0) {
          await queryDb(
            `UPDATE "OrderMessages" SET "Text" = ?, "AttachmentUrl" = ? WHERE "MessageId" = ?`,
            [msg.text || "", msg.attachmentUrl || null, msgId]
          );
        } else {
          await queryDb(
            `INSERT INTO "OrderMessages" ("MessageId", "OrderId", "SenderId", "SenderName", "SenderRole", "Text", "AttachmentUrl")
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              msgId,
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
    }

    return NextResponse.json({
      success: true,
      message: `Đã lưu đơn hàng ${order.id} vào Database!`
    });
  } catch (error: any) {
    console.error("Error saving order to DB:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


