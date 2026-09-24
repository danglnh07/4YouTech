import { NextResponse } from "next/server";
import { mysqlPool, getDbPool } from "@/lib/db";
import { SEED_ORDERS } from "@/lib/store";

export async function GET() {
  const dbType = (process.env.DB_TYPE || "mysql").toLowerCase();

  // Try MySQL Workbench first
  try {
    const [rows]: any = await mysqlPool.query(`
      SELECT o.*, 
        (SELECT JSON_ARRAYAGG(
            JSON_OBJECT('id', m.MessageId, 'senderId', m.SenderId, 'senderName', m.SenderName, 'senderRole', m.SenderRole, 'text', m.Text, 'attachmentUrl', m.AttachmentUrl, 'createdAt', m.CreatedAt)
         ) FROM OrderMessages m WHERE m.OrderId = o.OrderId ORDER BY m.CreatedAt ASC) AS messagesJson
      FROM ServiceOrders o
      ORDER BY o.CreatedAt DESC
    `);

    if (rows && rows.length > 0) {
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
        messages: row.messagesJson ? (typeof row.messagesJson === "string" ? JSON.parse(row.messagesJson) : row.messagesJson) : [],
        createdAt: row.CreatedAt,
        updatedAt: row.UpdatedAt
      }));

      return NextResponse.json({ source: "mysql_workbench", data: orders });
    }
  } catch (mysqlErr) {
    if (dbType === "mssql") {
      try {
        const pool = await getDbPool();
        const result = await pool.request().query(`
          SELECT o.*, 
            (SELECT * FROM dbo.OrderMessages msg WHERE msg.OrderId = o.OrderId ORDER BY msg.CreatedAt ASC FOR JSON PATH) AS messagesJson
          FROM dbo.ServiceOrders o
          ORDER BY o.CreatedAt DESC
        `);

        if (result.recordset.length > 0) {
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
            desiredDeadline: row.DesiredDeadline || "",
            status: row.Status,
            progressPercent: row.ProgressPercent,
            assignedStaffId: row.AssignedStaffId,
            assignedStaffName: row.AssignedStaffName,
            quotation: row.QuotationAmount ? {
              amount: parseFloat(row.QuotationAmount),
              finalDeadline: row.QuotationFinalDeadline || "",
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
            milestones: [],
            deliverables: [],
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
            isBeingEdited: Boolean(row.IsBeingEdited),
            editingNote: row.EditingNote,
            createdAt: row.CreatedAt,
            updatedAt: row.UpdatedAt
          }));

          return NextResponse.json({ source: "mssql", data: orders });
        }
      } catch (mssqlErr) {
        console.warn("MSSQL fetch orders fallback error:", mssqlErr);
      }
    }
  }

  return NextResponse.json({ source: "seed", data: SEED_ORDERS });
}

export async function POST(request: Request) {
  try {
    const order = await request.json();

    try {
      const sqlQuery = `
        INSERT INTO ServiceOrders (
          OrderId, ServiceId, ServiceName, Category, CustomerId, CustomerName, CustomerEmail, CustomerPhone,
          Requirements, AttachmentsJson, DesiredDeadline, Status, ProgressPercent, WorkEstimateJson, QuotationJson,
          PaymentInfoJson, AssignedStaffId, AssignedStaffName, CollaboratorsJson, MilestonesJson, DeliverablesJson,
          RevisionsJson, SupportTicketsJson, CancellationJson, IsBeingEdited, EditingNote
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          ServiceId = VALUES(ServiceId),
          ServiceName = VALUES(ServiceName),
          Category = VALUES(Category),
          CustomerId = VALUES(CustomerId),
          CustomerName = VALUES(CustomerName),
          CustomerEmail = VALUES(CustomerEmail),
          CustomerPhone = VALUES(CustomerPhone),
          Requirements = VALUES(Requirements),
          AttachmentsJson = VALUES(AttachmentsJson),
          DesiredDeadline = VALUES(DesiredDeadline),
          Status = VALUES(Status),
          ProgressPercent = VALUES(ProgressPercent),
          WorkEstimateJson = VALUES(WorkEstimateJson),
          QuotationJson = VALUES(QuotationJson),
          PaymentInfoJson = VALUES(PaymentInfoJson),
          AssignedStaffId = VALUES(AssignedStaffId),
          AssignedStaffName = VALUES(AssignedStaffName),
          CollaboratorsJson = VALUES(CollaboratorsJson),
          MilestonesJson = VALUES(MilestonesJson),
          DeliverablesJson = VALUES(DeliverablesJson),
          RevisionsJson = VALUES(RevisionsJson),
          SupportTicketsJson = VALUES(SupportTicketsJson),
          CancellationJson = VALUES(CancellationJson),
          IsBeingEdited = VALUES(IsBeingEdited),
          EditingNote = VALUES(EditingNote);
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
        order.isBeingEdited ? 1 : 0,
        order.editingNote || null
      ];

      await mysqlPool.execute(sqlQuery, params);

      // Save Order Messages
      if (order.messages && order.messages.length > 0) {
        for (const msg of order.messages) {
          await mysqlPool.execute(
            `INSERT INTO OrderMessages (MessageId, OrderId, SenderId, SenderName, SenderRole, Text, AttachmentUrl)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE Text = VALUES(Text), AttachmentUrl = VALUES(AttachmentUrl);`,
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

      return NextResponse.json({ success: true, message: `Đã lưu đơn hàng ${order.id} vào MySQL Workbench DB!` });
    } catch (mysqlErr: any) {
      const pool = await getDbPool();
      const query = `
        IF EXISTS (SELECT 1 FROM dbo.ServiceOrders WHERE OrderId = @OrderId)
        BEGIN
          UPDATE dbo.ServiceOrders
          SET ServiceId = @ServiceId,
              ServiceName = @ServiceName,
              Category = @Category,
              CustomerId = @CustomerId,
              CustomerName = @CustomerName,
              CustomerEmail = @CustomerEmail,
              CustomerPhone = @CustomerPhone,
              Requirements = @Requirements,
              AttachmentsJson = @AttachmentsJson,
              DesiredDeadline = @DesiredDeadline,
              Status = @Status,
              ProgressPercent = @ProgressPercent,
              AssignedStaffId = @AssignedStaffId,
              AssignedStaffName = @AssignedStaffName,
              QuotationAmount = @QuotationAmount,
              QuotationFinalDeadline = @QuotationFinalDeadline,
              QuotationMaxRevisions = @QuotationMaxRevisions,
              QuotationScopeDetails = @QuotationScopeDetails,
              QuotationIssuedAt = @QuotationIssuedAt,
              PaymentAmountPaid = @PaymentAmountPaid,
              PaymentMethod = @PaymentMethod,
              PaymentStatus = @PaymentStatus,
              PaymentReceiptImage = @PaymentReceiptImage,
              PaymentNote = @PaymentNote,
              IsBeingEdited = @IsBeingEdited,
              EditingNote = @EditingNote,
              UpdatedAt = GETDATE()
          WHERE OrderId = @OrderId;
        END
        ELSE
        BEGIN
          INSERT INTO dbo.ServiceOrders (
            OrderId, ServiceId, ServiceName, Category, CustomerId, CustomerName, CustomerEmail, CustomerPhone,
            Requirements, AttachmentsJson, DesiredDeadline, Status, ProgressPercent, AssignedStaffId, AssignedStaffName,
            QuotationAmount, QuotationFinalDeadline, QuotationMaxRevisions, QuotationScopeDetails, QuotationIssuedAt,
            PaymentAmountPaid, PaymentMethod, PaymentStatus, PaymentReceiptImage, PaymentNote, IsBeingEdited, EditingNote
          )
          VALUES (
            @OrderId, @ServiceId, @ServiceName, @Category, @CustomerId, @CustomerName, @CustomerEmail, @CustomerPhone,
            @Requirements, @AttachmentsJson, @DesiredDeadline, @Status, @ProgressPercent, @AssignedStaffId, @AssignedStaffName,
            @QuotationAmount, @QuotationFinalDeadline, @QuotationMaxRevisions, @QuotationScopeDetails, @QuotationIssuedAt,
            @PaymentAmountPaid, @PaymentMethod, @PaymentStatus, @PaymentReceiptImage, @PaymentNote, @IsBeingEdited, @EditingNote
          );
        END
      `;

      const req = pool.request();
      req.input("OrderId", order.id);
      req.input("ServiceId", order.serviceId || "");
      req.input("ServiceName", order.serviceName || "");
      req.input("Category", order.category || "IT");
      req.input("CustomerId", order.customerId || "");
      req.input("CustomerName", order.customerName || "");
      req.input("CustomerEmail", order.customerEmail || "");
      req.input("CustomerPhone", order.customerPhone || "");
      req.input("Requirements", order.requirements || "");
      req.input("AttachmentsJson", order.attachments ? JSON.stringify(order.attachments) : null);
      req.input("DesiredDeadline", order.desiredDeadline || null);
      req.input("Status", order.status || "submitted");
      req.input("ProgressPercent", order.progressPercent || 0);
      req.input("AssignedStaffId", order.assignedStaffId || null);
      req.input("AssignedStaffName", order.assignedStaffName || null);
      req.input("QuotationAmount", order.quotation?.amount || null);
      req.input("QuotationFinalDeadline", order.quotation?.finalDeadline || null);
      req.input("QuotationMaxRevisions", order.quotation?.maxRevisions || null);
      req.input("QuotationScopeDetails", order.quotation?.scopeDetails || null);
      req.input("QuotationIssuedAt", order.quotation?.issuedAt || null);
      req.input("PaymentAmountPaid", order.paymentInfo?.amountPaid || 0);
      req.input("PaymentMethod", order.paymentInfo?.paymentMethod || null);
      req.input("PaymentStatus", order.paymentInfo?.paymentStatus || null);
      req.input("PaymentReceiptImage", order.paymentInfo?.receiptImage || null);
      req.input("PaymentNote", order.paymentInfo?.note || null);
      req.input("IsBeingEdited", order.isBeingEdited ? 1 : 0);
      req.input("EditingNote", order.editingNote || null);

      await req.query(query);

      return NextResponse.json({ success: true, message: `Đã lưu đơn hàng ${order.id} vào SQL Server Database!` });
    }
  } catch (error: any) {
    console.error("Error saving order to DB:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
