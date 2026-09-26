import { NextResponse } from "next/server";
import { queryDb } from "@/lib/db";
import { SEED_TRANSACTIONS } from "@/lib/store";

export async function GET() {
  try {
    const rows = await queryDb<any>(`SELECT * FROM "PaymentTransactions" ORDER BY "CreatedAt" DESC`);
    if (rows && rows.length > 0) {
      const transactions = rows.map((row: any) => ({
        id: row.TransactionId || row.transactionid,
        orderId: row.OrderId || row.orderid,
        customerId: row.CustomerId || row.customerid,
        customerName: row.CustomerName || row.customername,
        amount: parseFloat(row.Amount || row.amount || 0),
        paymentType: row.PaymentType || row.paymenttype,
        paymentMethod: row.PaymentMethod || row.paymentmethod,
        receiptImage: row.ReceiptImage || row.receiptimage,
        note: row.Note || row.note,
        status: row.Status || row.status,
        vnpTxnRef: row.VnpTxnRef || row.vnptxnref,
        vnpBankCode: row.VnpBankCode || row.vnpbankcode,
        vnpResponseCode: row.VnpResponseCode || row.vnpresponsecode,
        createdAt: row.CreatedAt || row.createdat
      }));
      return NextResponse.json({ source: "db", data: transactions });
    }
  } catch (error) {
    console.warn("DB fetch transactions error:", error);
  }

  return NextResponse.json({ source: "seed", data: SEED_TRANSACTIONS });
}

export async function POST(request: Request) {
  try {
    const txn = await request.json();

    const existing = await queryDb<any>(
      `SELECT 1 FROM "PaymentTransactions" WHERE "TransactionId" = ?`,
      [txn.id]
    );

    if (existing && existing.length > 0) {
      await queryDb(
        `UPDATE "PaymentTransactions" SET
          "Amount" = ?,
          "PaymentType" = ?,
          "PaymentMethod" = ?,
          "ReceiptImage" = ?,
          "Note" = ?,
          "Status" = ?,
          "VnpTxnRef" = ?,
          "VnpBankCode" = ?,
          "VnpResponseCode" = ?
         WHERE "TransactionId" = ?`,
        [
          txn.amount || 0,
          txn.paymentType || "deposit",
          txn.paymentMethod || "VietQR",
          txn.receiptImage || null,
          txn.note || "",
          txn.status || "pending",
          txn.vnpTxnRef || null,
          txn.vnpBankCode || null,
          txn.vnpResponseCode || null,
          txn.id
        ]
      );
    } else {
      await queryDb(
        `INSERT INTO "PaymentTransactions" ("TransactionId", "OrderId", "CustomerId", "CustomerName", "Amount", "PaymentType", "PaymentMethod", "ReceiptImage", "Note", "Status", "VnpTxnRef", "VnpBankCode", "VnpResponseCode")
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
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
        ]
      );
    }

    return NextResponse.json({
      success: true,
      message: `Đã lưu giao dịch ${txn.id} vào Database!`
    });
  } catch (error: any) {
    console.error("Error saving transaction to DB:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


