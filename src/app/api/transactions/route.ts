import { NextResponse } from "next/server";
import { mysqlPool, getDbPool } from "@/lib/db";
import { SEED_TRANSACTIONS } from "@/lib/store";

export async function GET() {
  const dbType = (process.env.DB_TYPE || "mysql").toLowerCase();

  try {
    const [rows]: any = await mysqlPool.query("SELECT * FROM PaymentTransactions ORDER BY CreatedAt DESC");
    if (rows && rows.length > 0) {
      const transactions = rows.map((row: any) => ({
        id: row.TransactionId,
        orderId: row.OrderId,
        customerId: row.CustomerId,
        customerName: row.CustomerName,
        amount: parseFloat(row.Amount || 0),
        paymentType: row.PaymentType,
        paymentMethod: row.PaymentMethod,
        receiptImage: row.ReceiptImage,
        note: row.Note,
        status: row.Status,
        vnpTxnRef: row.VnpTxnRef,
        vnpBankCode: row.VnpBankCode,
        vnpResponseCode: row.VnpResponseCode,
        createdAt: row.CreatedAt
      }));
      return NextResponse.json({ source: "mysql_workbench", data: transactions });
    }
  } catch (mysqlError) {
    if (dbType === "mssql") {
      try {
        const pool = await getDbPool();
        const result = await pool.request().query("SELECT * FROM dbo.PaymentTransactions ORDER BY CreatedAt DESC");
        if (result.recordset.length > 0) {
          const transactions = result.recordset.map((row: any) => ({
            id: row.TransactionId,
            orderId: row.OrderId,
            customerId: row.CustomerId,
            customerName: row.CustomerName,
            amount: parseFloat(row.Amount || 0),
            paymentMethod: row.PaymentMethod,
            receiptImage: row.ReceiptImageUrl,
            note: row.Note,
            status: row.Status,
            createdAt: row.CreatedAt
          }));
          return NextResponse.json({ source: "mssql", data: transactions });
        }
      } catch (mssqlError) {
        console.warn("MSSQL fetch transactions fallback error:", mssqlError);
      }
    }
  }

  return NextResponse.json({ source: "seed", data: SEED_TRANSACTIONS });
}

export async function POST(request: Request) {
  try {
    const txn = await request.json();

    try {
      const sqlQuery = `
        INSERT INTO PaymentTransactions (TransactionId, OrderId, CustomerId, CustomerName, Amount, PaymentType, PaymentMethod, ReceiptImage, Note, Status, VnpTxnRef, VnpBankCode, VnpResponseCode)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          Amount = VALUES(Amount),
          PaymentType = VALUES(PaymentType),
          PaymentMethod = VALUES(PaymentMethod),
          ReceiptImage = VALUES(ReceiptImage),
          Note = VALUES(Note),
          Status = VALUES(Status),
          VnpTxnRef = VALUES(VnpTxnRef),
          VnpBankCode = VALUES(VnpBankCode),
          VnpResponseCode = VALUES(VnpResponseCode);
      `;
      const params = [
        txn.id,
        txn.orderId || "",
        txn.customerId || "",
        txn.customerName || "",
        txn.amount || 0,
        txn.paymentType || "deposit",
        txn.paymentMethod || "VietQR",
        txn.receiptImage || null,
        txn.note || "",
        txn.status || "pending",
        txn.vnpTxnRef || null,
        txn.vnpBankCode || null,
        txn.vnpResponseCode || null
      ];

      await mysqlPool.execute(sqlQuery, params);
      return NextResponse.json({ success: true, message: `Đã lưu giao dịch ${txn.id} vào MySQL Workbench DB!` });
    } catch (mysqlErr: any) {
      const pool = await getDbPool();
      const query = `
        IF EXISTS (SELECT 1 FROM dbo.PaymentTransactions WHERE TransactionId = @TransactionId)
        BEGIN
          UPDATE dbo.PaymentTransactions
          SET Status = @Status
          WHERE TransactionId = @TransactionId;
        END
        ELSE
        BEGIN
          INSERT INTO dbo.PaymentTransactions (TransactionId, OrderId, CustomerId, CustomerName, Amount, PaymentMethod, ReceiptImageUrl, Note, Status)
          VALUES (@TransactionId, @OrderId, @CustomerId, @CustomerName, @Amount, @PaymentMethod, @ReceiptImageUrl, @Note, @Status);
        END
      `;

      const req = pool.request();
      req.input("TransactionId", txn.id);
      req.input("OrderId", txn.orderId || "");
      req.input("CustomerId", txn.customerId || "");
      req.input("CustomerName", txn.customerName || "");
      req.input("Amount", txn.amount || 0);
      req.input("PaymentMethod", txn.paymentMethod || "VietQR");
      req.input("ReceiptImageUrl", txn.receiptImage || null);
      req.input("Note", txn.note || "");
      req.input("Status", txn.status || "pending");

      await req.query(query);
      return NextResponse.json({ success: true, message: `Đã lưu giao dịch ${txn.id} vào SQL Server Database!` });
    }
  } catch (error: any) {
    console.error("Error saving transaction to DB:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
