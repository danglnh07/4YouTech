import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";
import { SEED_ORDERS } from "@/lib/store";

export async function GET() {
  try {
    const pool = await getDbPool();
    const result = await pool.request().query(`
      SELECT o.*, 
        (SELECT * FROM dbo.OrderMilestones m WHERE m.OrderId = o.OrderId FOR JSON PATH) AS milestonesJson,
        (SELECT * FROM dbo.OrderDeliverables d WHERE d.OrderId = o.OrderId FOR JSON PATH) AS deliverablesJson,
        (SELECT * FROM dbo.OrderMessages msg WHERE msg.OrderId = o.OrderId ORDER BY msg.CreatedAt ASC FOR JSON PATH) AS messagesJson
      FROM dbo.ServiceOrders o
      ORDER BY o.CreatedAt DESC
    `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ source: "seed", data: SEED_ORDERS });
    }

    const orders = result.recordset.map((row: any) => ({
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
      desiredDeadline: row.DesiredDeadline ? new Date(row.DesiredDeadline).toISOString().split('T')[0] : "",
      status: row.Status,
      progressPercent: row.ProgressPercent,
      assignedStaffId: row.AssignedStaffId,
      assignedStaffName: row.AssignedStaffName,
      quotation: row.QuotationAmount ? {
        amount: parseFloat(row.QuotationAmount),
        finalDeadline: row.QuotationFinalDeadline ? new Date(row.QuotationFinalDeadline).toISOString().split('T')[0] : "",
        maxRevisions: row.QuotationMaxRevisions,
        scopeDetails: row.QuotationScopeDetails,
        issuedAt: row.QuotationIssuedAt
      } : undefined,
      paymentInfo: {
        amountPaid: parseFloat(row.PaymentAmountPaid || 0),
        paymentMethod: row.PaymentMethod,
        paymentStatus: row.PaymentStatus,
        receiptImage: row.PaymentReceiptImage,
        note: row.PaymentNote
      },
      milestones: row.milestonesJson ? JSON.parse(row.milestonesJson).map((m: any) => ({
        id: m.MilestoneId,
        title: m.Title,
        targetDate: m.TargetDate,
        completed: m.IsCompleted,
        updatedBy: m.UpdatedBy
      })) : [],
      deliverables: row.deliverablesJson ? JSON.parse(row.deliverablesJson).map((d: any) => ({
        id: d.DeliverableId,
        version: d.Version,
        title: d.Title,
        fileLink: d.FileLink,
        previewUrl: d.PreviewUrl,
        notes: d.Notes,
        timestamp: d.Timestamp,
        status: d.Status
      })) : [],
      revisions: [],
      messages: row.messagesJson ? JSON.parse(row.messagesJson).map((msg: any) => ({
        id: msg.MessageId,
        senderId: msg.SenderId,
        senderName: msg.SenderName,
        senderRole: msg.SenderRole,
        text: msg.Text,
        createdAt: msg.CreatedAt
      })) : [],
      supportTickets: [],
      isBeingEdited: row.IsBeingEdited,
      editingNote: row.EditingNote,
      createdAt: row.CreatedAt,
      updatedAt: row.UpdatedAt
    }));

    return NextResponse.json({ source: "mssql", data: orders });
  } catch (error: any) {
    return NextResponse.json({ source: "fallback", data: SEED_ORDERS, error: error.message });
  }
}
