import { NextResponse } from "next/server";
import { getPgPool } from "@/lib/db";
import { SEED_TRANSACTIONS } from "@/lib/store";

export async function GET() {
  try {
    const { rows } = await getPgPool().query(
      `SELECT * FROM "PaymentTransactions" ORDER BY "CreatedAt" DESC`
    );
    if (rows.length > 0) {
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
      return NextResponse.json({ source: "postgres", data: transactions });
    }
  } catch (error) {
    console.warn("Postgres fetch transactions error:", error);
  }

  return NextResponse.json({ source: "seed", data: SEED_TRANSACTIONS });
}

export async function POST(request: Request) {
  try {
    const txn = await request.json();

    const query = `
      INSERT INTO "PaymentTransactions" ("TransactionId", "OrderId", "CustomerId", "CustomerName", "Amount", "PaymentType", "PaymentMethod", "ReceiptImage", "Note", "Status", "VnpTxnRef", "VnpBankCode", "VnpResponseCode")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT ("TransactionId") DO UPDATE SET
        "Amount" = EXCLUDED."Amount",
        "PaymentType" = EXCLUDED."PaymentType",
        "PaymentMethod" = EXCLUDED."PaymentMethod",
        "ReceiptImage" = EXCLUDED."ReceiptImage",
        "Note" = EXCLUDED."Note",
        "Status" = EXCLUDED."Status",
        "VnpTxnRef" = EXCLUDED."VnpTxnRef",
        "VnpBankCode" = EXCLUDED."VnpBankCode",
        "VnpResponseCode" = EXCLUDED."VnpResponseCode";
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

    await getPgPool().query(query, params);
    return NextResponse.json({
      success: true,
      message: `Đã lưu giao dịch ${txn.id} vào PostgreSQL!`
    });
  } catch (error: any) {
    console.error("Error saving transaction to DB:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
